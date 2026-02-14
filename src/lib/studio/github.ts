import { clerkClient } from "@clerk/nextjs/server";
import type { ScaffoldFile } from "./types";

const GITHUB_API = "https://api.github.com";

export async function getGitHubToken(clerkUserId: string): Promise<string> {
  const client = await clerkClient();
  const tokens = await client.users.getUserOauthAccessToken(
    clerkUserId,
    "github",
  );

  const token = tokens.data[0]?.token;
  if (!token) {
    throw new Error(
      "No GitHub token found. Please connect your GitHub account in your profile settings.",
    );
  }
  return token;
}

export async function getGitHubUser(
  token: string,
): Promise<{ login: string; id: number }> {
  const res = await fetch(`${GITHUB_API}/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
    },
  });
  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

export async function createRepo(
  token: string,
  opts: {
    name: string;
    description?: string;
    isPrivate?: boolean;
    homepage?: string;
    org?: string;
  },
): Promise<{ full_name: string; html_url: string; default_branch: string }> {
  const url = opts.org
    ? `${GITHUB_API}/orgs/${opts.org}/repos`
    : `${GITHUB_API}/user/repos`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: opts.name,
      description: opts.description || "shadcn/ui component registry",
      private: opts.isPrivate ?? false,
      auto_init: true,
      has_issues: true,
      has_projects: false,
      has_wiki: false,
      homepage: opts.homepage,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    if (res.status === 422 && body.includes("already exists")) {
      throw new Error(
        `Repository "${opts.name}" already exists. Choose a different name.`,
      );
    }
    throw new Error(`Failed to create repository: ${res.status} ${body}`);
  }

  return res.json();
}

export async function pushFiles(
  token: string,
  owner: string,
  repo: string,
  files: ScaffoldFile[],
  message: string,
): Promise<string> {
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github.v3+json",
    "Content-Type": "application/json",
  };

  const refRes = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/git/ref/heads/main`,
    { headers },
  );
  const hasExistingCommits = refRes.ok;
  let parentSha: string | undefined;
  let baseTreeSha: string | undefined;

  if (hasExistingCommits) {
    const refData = await refRes.json();
    parentSha = refData.object.sha;
    const parentCommitRes = await fetch(
      `${GITHUB_API}/repos/${owner}/${repo}/git/commits/${parentSha}`,
      { headers },
    );
    if (parentCommitRes.ok) {
      const parentCommit = await parentCommitRes.json();
      baseTreeSha = parentCommit.tree.sha;
    }
  }

  const blobs = await Promise.all(
    files.map(async (file) => {
      const res = await fetch(
        `${GITHUB_API}/repos/${owner}/${repo}/git/blobs`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            content: file.content,
            encoding: "utf-8",
          }),
        },
      );
      if (!res.ok) {
        throw new Error(
          `Failed to create blob for ${file.path}: ${res.status}`,
        );
      }
      const data = await res.json();
      return { path: file.path, sha: data.sha };
    }),
  );

  const treeBody: Record<string, unknown> = {
    tree: blobs.map((blob) => ({
      path: blob.path,
      mode: "100644",
      type: "blob",
      sha: blob.sha,
    })),
  };
  if (baseTreeSha) {
    treeBody.base_tree = baseTreeSha;
  }

  const treeRes = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/git/trees`,
    {
      method: "POST",
      headers,
      body: JSON.stringify(treeBody),
    },
  );
  if (!treeRes.ok) {
    throw new Error(`Failed to create tree: ${treeRes.status}`);
  }
  const treeData = await treeRes.json();

  const commitBody: Record<string, unknown> = {
    message,
    tree: treeData.sha,
  };
  if (parentSha) {
    commitBody.parents = [parentSha];
  }

  const commitRes = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/git/commits`,
    {
      method: "POST",
      headers,
      body: JSON.stringify(commitBody),
    },
  );
  if (!commitRes.ok) {
    throw new Error(`Failed to create commit: ${commitRes.status}`);
  }
  const commitData = await commitRes.json();

  if (hasExistingCommits) {
    const updateRefRes = await fetch(
      `${GITHUB_API}/repos/${owner}/${repo}/git/refs/heads/main`,
      {
        method: "PATCH",
        headers,
        body: JSON.stringify({ sha: commitData.sha }),
      },
    );
    if (!updateRefRes.ok) {
      throw new Error(`Failed to update ref: ${updateRefRes.status}`);
    }
  } else {
    const createRefRes = await fetch(
      `${GITHUB_API}/repos/${owner}/${repo}/git/refs`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          ref: "refs/heads/main",
          sha: commitData.sha,
        }),
      },
    );
    if (!createRefRes.ok) {
      throw new Error(`Failed to create ref: ${createRefRes.status}`);
    }
  }

  return commitData.sha;
}

export async function pushFilesIncremental(
  token: string,
  owner: string,
  repo: string,
  files: ScaffoldFile[],
  deletedPaths: string[],
  parentSha: string,
  message: string,
): Promise<string> {
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github.v3+json",
    "Content-Type": "application/json",
  };

  const blobs = await Promise.all(
    files.map(async (file) => {
      const res = await fetch(
        `${GITHUB_API}/repos/${owner}/${repo}/git/blobs`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            content: file.content,
            encoding: "utf-8",
          }),
        },
      );
      if (!res.ok) {
        throw new Error(
          `Failed to create blob for ${file.path}: ${res.status}`,
        );
      }
      const data = await res.json();
      return { path: file.path, sha: data.sha };
    }),
  );

  const commitRes = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/git/commits/${parentSha}`,
    { headers },
  );
  if (!commitRes.ok) {
    throw new Error(`Failed to get parent commit: ${commitRes.status}`);
  }
  const parentCommit = await commitRes.json();

  const treeEntries = [
    ...blobs.map((blob) => ({
      path: blob.path,
      mode: "100644" as const,
      type: "blob" as const,
      sha: blob.sha,
    })),
    ...deletedPaths.map((path) => ({
      path,
      mode: "100644" as const,
      type: "blob" as const,
      sha: null,
    })),
  ];

  const treeRes = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/git/trees`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        base_tree: parentCommit.tree.sha,
        tree: treeEntries,
      }),
    },
  );
  if (!treeRes.ok) {
    throw new Error(`Failed to create tree: ${treeRes.status}`);
  }
  const treeData = await treeRes.json();

  const newCommitRes = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/git/commits`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        message,
        tree: treeData.sha,
        parents: [parentSha],
      }),
    },
  );
  if (!newCommitRes.ok) {
    throw new Error(`Failed to create commit: ${newCommitRes.status}`);
  }
  const newCommit = await newCommitRes.json();

  const refRes = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/git/refs/heads/main`,
    {
      method: "PATCH",
      headers,
      body: JSON.stringify({ sha: newCommit.sha }),
    },
  );
  if (!refRes.ok) {
    throw new Error(`Failed to update ref: ${refRes.status}`);
  }

  return newCommit.sha;
}

export interface GitHubRepoInfo {
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  private: boolean;
  default_branch: string;
  owner: { login: string };
}

export interface GitHubOrgInfo {
  login: string;
  avatar_url: string;
}

export async function listUserOrgs(token: string): Promise<GitHubOrgInfo[]> {
  const res = await fetch(`${GITHUB_API}/user/orgs?per_page=100`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
    },
  });
  if (!res.ok) {
    return [];
  }
  return res.json();
}

export async function listUserRepos(
  token: string,
  org?: string,
): Promise<GitHubRepoInfo[]> {
  const url = org
    ? `${GITHUB_API}/orgs/${org}/repos?sort=updated&per_page=100`
    : `${GITHUB_API}/user/repos?sort=updated&per_page=100&type=owner`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
    },
  });
  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

export async function enableGitHubPages(
  token: string,
  owner: string,
  repo: string,
): Promise<string> {
  const res = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/pages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        source: {
          branch: "main",
          path: "/",
        },
        build_type: "workflow",
      }),
    },
  );

  if (!res.ok && res.status !== 409) {
    throw new Error(`Failed to enable GitHub Pages: ${res.status}`);
  }

  return `https://${owner}.github.io/${repo}`;
}

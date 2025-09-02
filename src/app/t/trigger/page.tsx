import { ComponentPageTemplate } from "@/components/component-page-template";
import { BranchIcon } from "@/components/icons/branch";
import { ServerIcon } from "@/components/icons/server";
import { TriggerIcon } from "@/components/icons/trigger";
import { ZapIcon } from "@/components/icons/zap";

export default function TriggerPage() {
  const features = [
    {
      icon: <ZapIcon className="w-3 h-3" />,
      title: "Job Queue Components",
      description: "Async job processing, scheduling, and priority handling",
    },
    {
      icon: <ServerIcon className="w-3 h-3" />,
      title: "Monitoring Dashboard",
      description: "Real-time job status, logs, and performance metrics",
    },
    {
      icon: <BranchIcon className="w-3 h-3" />,
      title: "Workflow Management",
      description:
        "Complex job chains, conditional execution, and error handling",
    },
  ];

  const technicalDetails = [
    {
      icon: <ZapIcon className="w-6 h-6" />,
      title: "High Performance",
      description:
        "Optimized queue processing with Redis backend and intelligent batching",
    },
    {
      icon: <ServerIcon className="w-6 h-6" />,
      title: "Real-time Monitoring",
      description:
        "Live dashboard with job metrics, error tracking, and performance insights",
    },
    {
      icon: <BranchIcon className="w-6 h-6" />,
      title: "Error Recovery",
      description:
        "Automatic retry with exponential backoff and dead letter queues",
    },
  ];

  const usageExample = `<span class="text-blue-400">import</span>
<span class="text-foreground"> {"{ TriggerJobs }"} </span>
<span class="text-blue-400">from</span>
<span class="text-green-400"> "@/components/trigger-jobs"</span>
<br />
<span class="text-gray-500">{"<TriggerJobs />"}</span>`;

  const additionalExamples = [
    {
      title: "Create a job",
      code: `<span class="text-blue-400">await</span> <span class="text-foreground">trigger.send</span>(<span class="text-green-400">"send-email"</span>, data)`,
    },
  ];

  return (
    <ComponentPageTemplate
      brandColor="#8B5CF6"
      darkBrandColor="#8DFF53"
      category="BACKGROUND JOBS"
      name="Trigger.dev"
      description="Background job scheduling and monitoring components. Built-in queue management, retry logic, and real-time job tracking dashboard."
      icon={<TriggerIcon className="w-12 h-12" />}
      features={features}
      technicalDetails={technicalDetails}
      installCommand="shadcn@latest add @elements/trigger-jobs"
      usageExample={usageExample}
      additionalExamples={additionalExamples}
    >
      {/* Job Types Section */}
      <div className="border-t border-border border-dotted px-8 lg:px-16 py-16">
        <div className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Job Types & Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Handle any background task with built-in retry logic, scheduling,
              and monitoring.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="border border-border rounded-lg p-6 bg-card/30 ">
              <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-4">
                <ZapIcon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-3">Instant Jobs</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Execute jobs immediately with priority queuing and parallel
                processing
              </p>
              <div className="bg-muted/50 rounded p-2 font-mono text-xs">
                trigger.send("process-payment")
              </div>
            </div>

            <div className="border border-border rounded-lg p-6 bg-card/30 ">
              <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-4">
                <ServerIcon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-3">Scheduled Jobs</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Cron-like scheduling with timezone support and recurring
                patterns
              </p>
              <div className="bg-muted/50 rounded p-2 font-mono text-xs">
                trigger.scheduleJob("0 9 * * *")
              </div>
            </div>

            <div className="border border-border rounded-lg p-6 bg-card/30 ">
              <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-4">
                <BranchIcon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-3">Workflow Jobs</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Chain multiple jobs with conditional logic and error branching
              </p>
              <div className="bg-muted/50 rounded p-2 font-mono text-xs">
                trigger.workflow([job1, job2])
              </div>
            </div>
          </div>
        </div>
      </div>
    </ComponentPageTemplate>
  );
}

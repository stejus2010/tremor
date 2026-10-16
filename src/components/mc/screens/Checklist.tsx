import { ArrowLeft, ArrowRight, ClipboardList, Moon, Coffee, Activity, Wind, Sparkles } from "lucide-react";
import { useSession, type ChecklistAnswer, type ChecklistAnswers } from "@/mc/session";
import { Btn, Card, Notice, Page, Stepper, TopBar } from "../ui";

const QUESTIONS: { key: keyof ChecklistAnswers; title: string; question: string; Icon: typeof Moon }[] = [
  { key: "dreamEnactment", title: "Dream enactment", question: "Do you frequently act out vivid dreams while sleeping (for example, thrashing, kicking, punching, or shouting)?", Icon: Moon },
  { key: "smellLoss", title: "Loss or reduction of smell", question: "Have you noticed a significant decrease in your ability to smell everyday odors, foods, or flowers, unrelated to a cold or sinus issue?", Icon: Wind },
  { key: "constipation", title: "Chronic constipation", question: "Have you experienced persistent, long-term bowel slowness or constipation that does not resolve easily with diet changes?", Icon: Activity },
  { key: "movementSlowness", title: "Slowness of movement or handwriting changes", question: "Have you noticed a general slowing down in your physical actions, smaller handwriting, or difficulty doing fine tasks like buttoning a shirt?", Icon: Sparkles },
  { key: "caffeineOrMedication", title: "Caffeine sensitivity or medication-related shaking", question: "Do you notice shaking or jitteriness specifically after consuming coffee/caffeine, or did shaking start after taking a new prescription medication (for example, asthma inhalers, certain antidepressants, or mood stabilizers)?", Icon: Coffee },
];

const OPTIONS: { value: ChecklistAnswer; label: string }[] = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "not_sure", label: "Not sure" },
];

const emptyAnswers = (): ChecklistAnswers => ({
  dreamEnactment: "not_sure",
  smellLoss: "not_sure",
  constipation: "not_sure",
  movementSlowness: "not_sure",
  caffeineOrMedication: "not_sure",
});

const answerLabel = (value: ChecklistAnswer) => value === "yes" ? "Yes" : value === "no" ? "No" : "Not sure";

export function ChecklistScreen() {
  const s = useSession();
  const answers = s.session.checklist ?? emptyAnswers();

  const choose = (key: keyof ChecklistAnswers, value: ChecklistAnswer) => {
    s.setChecklist({ ...answers, [key]: value });
  };

  return (
    <Page className="max-w-4xl">
      <TopBar onBack={() => s.go("setup")} />
      <Stepper current={0} />
      <div className="flex items-start gap-3">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-blue/15 text-cyan"><ClipboardList className="h-6 w-6" /></div>
        <div>
          <h1 className="text-3xl font-bold">Preliminary Parkinson's &amp; Symptom Checklist</h1>
          <p className="mt-2 text-muted-foreground">Answer each question as best you can. Choose “Not sure” if you cannot confidently answer.</p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {QUESTIONS.map(({ key, title, question, Icon }, index) => (
          <Card key={key} className="p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue/10 text-cyan"><Icon className="h-5 w-5" /></div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Question {index + 1} of {QUESTIONS.length}</div>
                <h2 className="mt-1 text-lg font-semibold">{title}</h2>
                <p className="mt-2 leading-relaxed text-muted-foreground">{question}</p>
                <div className="mt-4 grid grid-cols-3 gap-2" role="radiogroup" aria-label={title}>
                  {OPTIONS.map((option) => {
                    const active = answers[key] === option.value;
                    return (
                      <button key={option.value} type="button" role="radio" aria-checked={active}
                        onClick={() => choose(key, option.value)}
                        className={`min-h-12 rounded-xl border px-2 py-3 text-sm font-semibold transition-colors sm:px-4 ${active ? "border-cyan bg-cyan/10 text-foreground ring-1 ring-cyan" : "border-border bg-background text-muted-foreground hover:bg-muted"}`}>
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Notice tone="warning" className="mt-5">
        This is an informal symptom checklist, not a validated diagnostic questionnaire. These symptoms can have many causes and do not establish whether someone has Parkinson's disease. Your answers are recorded in this assessment session and shown in the report, but they do not change the app's screening prediction. If you have concerns about symptoms, discuss them with a qualified healthcare professional.
      </Notice>
      <Notice className="mt-3">
        Privacy: answers are held in memory for this session only. They are not uploaded or saved to browser storage, and are cleared when you end the session or start a new one.
      </Notice>
      <div className="mt-6 flex flex-wrap justify-between gap-3">
        <Btn variant="secondary" onClick={() => s.go("setup")}><ArrowLeft className="h-5 w-5" /> Back to setup</Btn>
        <Btn onClick={() => s.go("instructions")}>Continue to tests <ArrowRight className="h-5 w-5" /></Btn>
      </div>
    </Page>
  );
}

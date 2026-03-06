import { useState } from "react";
import { useProject } from "@/context/ProjectContext";
import { PinType } from "@/data/projects";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const pinDotColors: Record<PinType, string> = {
  plot: "bg-destructive",
  character: "bg-primary",
  location: "bg-secondary",
};

const TimelinePage = () => {
  const { currentProject, addTimelineEvent, addPin } = useProject();
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({ title: "", chapter: 1, character: "", location: "", note: "" });

  const timeline = currentProject.timeline;

  const handleAdd = () => {
    if (!form.title.trim()) return;
    const charObj = currentProject.characters.find((c) => c.name === form.character);
    addTimelineEvent({
      title: form.title,
      chapter: form.chapter,
      character: form.character || "Unknown",
      characterInitial: charObj?.initial || form.character?.[0]?.toUpperCase() || "?",
      pinType: "plot",
      location: form.location || "Unknown",
    });
    // Also add a corresponding map pin
    const locObj = currentProject.locations.find((l) => l.name === form.location);
    addPin({
      title: form.title,
      type: "plot",
      chapter: form.chapter,
      location: form.location || "Unknown",
      note: form.note,
      x: 30 + Math.random() * 40,
      y: 20 + Math.random() * 60,
    });
    setForm({ title: "", chapter: 1, character: "", location: "", note: "" });
    setShowAddModal(false);
  };

  if (timeline.length === 0) {
    return (
      <div className="p-6 md:p-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-serif font-semibold">{currentProject.title} — Timeline</h1>
          <Button onClick={() => setShowAddModal(true)} className="bg-primary text-primary-foreground text-xs">
            <Plus className="h-3 w-3 mr-1" /> Add Event
          </Button>
        </div>
        <div className="text-center py-20">
          <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <span className="text-2xl">📅</span>
          </div>
          <h2 className="text-lg font-serif font-semibold mb-2">No events on your timeline yet</h2>
          <p className="text-sm text-muted-foreground mb-6">Add plot pins on your map to populate the timeline</p>
          <Button onClick={() => setShowAddModal(true)} className="bg-primary text-primary-foreground">
            <Plus className="h-3 w-3 mr-1" /> Add Event
          </Button>
        </div>
        <AddEventModal
          open={showAddModal}
          onOpenChange={setShowAddModal}
          form={form}
          setForm={setForm}
          onAdd={handleAdd}
          characters={currentProject.characters}
          locations={currentProject.locations}
        />
      </div>
    );
  }

  const maxChapter = Math.max(...timeline.map((e) => e.chapter));
  const chapters = new Map<number, typeof timeline>();
  timeline.forEach((e) => {
    const arr = chapters.get(e.chapter) || [];
    arr.push(e);
    chapters.set(e.chapter, arr);
  });
  const sortedChapters = Array.from(chapters.entries()).sort(([a], [b]) => a - b);
  const currentChapter = sortedChapters[sortedChapters.length - 1]?.[0] || 1;

  return (
    <div className="p-6 md:p-10">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-xl font-serif font-semibold">{currentProject.title} — Timeline</h1>
        <Button onClick={() => setShowAddModal(true)} className="bg-primary text-primary-foreground text-xs">
          <Plus className="h-3 w-3 mr-1" /> Add Event
        </Button>
      </div>

      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
          <span>Chapter 1</span>
          <span>Chapter {currentChapter} of {maxChapter}</span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(currentChapter / maxChapter) * 100}%` }} />
        </div>
      </div>

      {/* Horizontal scrollable timeline */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-6 min-w-max">
          {sortedChapters.map(([chapter, events]) => (
            <div key={chapter} className="flex flex-col items-start">
              <span className="text-xs font-medium text-muted-foreground mb-3 px-1">Ch. {chapter}</span>
              <div className="flex gap-3">
                {events.map((event) => (
                  <div key={event.id} className="w-56 border border-border rounded-lg p-4 bg-card hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`w-2 h-2 rounded-full ${pinDotColors[event.pinType]}`} />
                      <span className="text-xs text-muted-foreground">{event.location}</span>
                    </div>
                    <h3 className="text-sm font-semibold font-serif mb-2">{event.title}</h3>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold">
                        {event.characterInitial}
                      </div>
                      <span className="text-xs text-muted-foreground">{event.character}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-2 border-t border-dashed border-border" />

      <AddEventModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        form={form}
        setForm={setForm}
        onAdd={handleAdd}
        characters={currentProject.characters}
        locations={currentProject.locations}
      />
    </div>
  );
};

function AddEventModal({
  open, onOpenChange, form, setForm, onAdd, characters, locations,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  form: { title: string; chapter: number; character: string; location: string; note: string };
  setForm: (f: typeof form) => void;
  onAdd: () => void;
  characters: { id: string; name: string }[];
  locations: { id: string; name: string }[];
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">Add Event</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 pt-2">
          <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Event title" className="font-serif" />
          <Input type="number" value={form.chapter} onChange={(e) => setForm({ ...form, chapter: Number(e.target.value) })} placeholder="Chapter" />
          <select value={form.character} onChange={(e) => setForm({ ...form, character: e.target.value })} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
            <option value="">Select character...</option>
            {characters.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>
          <select value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
            <option value="">Select location...</option>
            {locations.map((l) => <option key={l.id} value={l.name}>{l.name}</option>)}
          </select>
          <Input value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="Note (optional)" />
          <Button onClick={onAdd} disabled={!form.title.trim()} className="w-full bg-primary text-primary-foreground">Add to Timeline</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default TimelinePage;

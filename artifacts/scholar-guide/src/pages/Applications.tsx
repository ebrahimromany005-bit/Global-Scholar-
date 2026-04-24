import { Link } from "wouter";
import { useState } from "react";
import {
  useListApplications,
  useUpdateApplication,
  useDeleteApplication,
  getListApplicationsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useGuestUserId } from "@/hooks/useGuestUserId";
import { useLang } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, ExternalLink, Sparkles, ListChecks } from "lucide-react";

const STATUSES = ["planning", "in_progress", "submitted", "accepted", "rejected"] as const;
type Status = typeof STATUSES[number];

const STATUS_COLOR: Record<Status, string> = {
  planning: "bg-muted text-muted-foreground",
  in_progress: "bg-secondary/15 text-secondary",
  submitted: "bg-primary/15 text-primary",
  accepted: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  rejected: "bg-destructive/15 text-destructive",
};

export default function Applications() {
  const userId = useGuestUserId();
  const { lang, t } = useLang();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [view, setView] = useState<"kanban" | "list">("kanban");

  const apps = useListApplications({ userId });
  const updateApp = useUpdateApplication();
  const deleteApp = useDeleteApplication();

  const refresh = () =>
    queryClient.invalidateQueries({ queryKey: getListApplicationsQueryKey({ userId }) });

  const onUpdateStatus = (id: number, status: Status) => {
    updateApp.mutate(
      { id, data: { status } },
      {
        onSuccess: () => {
          refresh();
          toast({ title: lang === "ar" ? "تم التحديث" : "Status updated" });
        },
      },
    );
  };

  const onDelete = (id: number) => {
    deleteApp.mutate(
      { id },
      {
        onSuccess: () => {
          refresh();
          toast({ title: lang === "ar" ? "تم الحذف" : "Deleted" });
        },
      },
    );
  };

  const list = apps.data ?? [];

  if (!apps.isLoading && list.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="text-7xl mb-4">📋</div>
        <h1 className="text-2xl font-bold mb-2">{t("applications_empty")}</h1>
        <p className="text-muted-foreground mb-6">
          {lang === "ar"
            ? "ابدأ بحفظ الفرص التي تهتم بها لتتبعها هنا."
            : "Start tracking opportunities you're interested in."}
        </p>
        <Link href="/opportunities">
          <Button size="lg">{lang === "ar" ? "تصفح الفرص" : "Browse Opportunities"}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold flex items-center gap-2">
            <ListChecks className="h-8 w-8 text-primary" />
            {lang === "ar" ? "تتبع الطلبات" : "Application Tracker"}
          </h1>
          <p className="text-muted-foreground">
            {lang === "ar"
              ? `تتابع ${list.length} طلب`
              : `Tracking ${list.length} applications`}
          </p>
        </div>
        <div className="flex gap-1 bg-muted rounded-lg p-1">
          <Button
            size="sm"
            variant={view === "kanban" ? "default" : "ghost"}
            onClick={() => setView("kanban")}
          >
            {lang === "ar" ? "لوحة" : "Board"}
          </Button>
          <Button
            size="sm"
            variant={view === "list" ? "default" : "ghost"}
            onClick={() => setView("list")}
          >
            {lang === "ar" ? "قائمة" : "List"}
          </Button>
        </div>
      </div>

      {view === "kanban" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {STATUSES.map((status) => {
            const items = list.filter((a) => a.status === status);
            return (
              <div key={status} className="bg-muted/40 rounded-xl p-3">
                <div className="flex items-center justify-between mb-3 px-1">
                  <span className={`text-xs font-bold px-2 py-1 rounded-md ${STATUS_COLOR[status]}`}>
                    {t(`status_${status}` as "status_planning")}
                  </span>
                  <Badge variant="outline" className="text-xs">{items.length}</Badge>
                </div>
                <div className="space-y-2 min-h-32">
                  {items.map((a) => (
                    <Card key={a.id} className="p-3 hover-elevate">
                      <div className="text-xs text-muted-foreground mb-1">
                        {lang === "ar" ? a.countryNameAr : a.countryName}
                      </div>
                      <Link href={`/opportunities/${a.opportunityId}`} className="font-medium text-sm leading-tight hover:text-primary line-clamp-2 block">
                        {lang === "ar" ? a.opportunityTitleAr : a.opportunityTitle}
                      </Link>
                      {a.deadline && (
                        <div className="text-[10px] text-muted-foreground mt-2">
                          {new Date(a.deadline).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US")}
                        </div>
                      )}
                      <div className="flex gap-1 mt-3">
                        <Select
                          value={a.status}
                          onValueChange={(v) => onUpdateStatus(a.id, v as Status)}
                        >
                          <SelectTrigger className="text-xs h-7">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {STATUSES.map((s) => (
                              <SelectItem key={s} value={s} className="text-xs">
                                {t(`status_${s}` as "status_planning")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => onDelete(a.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-2">
          {list.map((a) => (
            <Card key={a.id} className="p-4 flex items-center gap-3 hover-elevate">
              <Badge className={STATUS_COLOR[a.status as Status] || ""}>
                {t(`status_${a.status}` as "status_planning")}
              </Badge>
              <div className="flex-1 min-w-0">
                <Link href={`/opportunities/${a.opportunityId}`} className="font-medium hover:text-primary block truncate">
                  {lang === "ar" ? a.opportunityTitleAr : a.opportunityTitle}
                </Link>
                <div className="text-xs text-muted-foreground">
                  {lang === "ar" ? a.countryNameAr : a.countryName} · {t(a.type === "scholarship" ? "scholarship" : "migration")}
                </div>
              </div>
              <Select value={a.status} onValueChange={(v) => onUpdateStatus(a.id, v as Status)}>
                <SelectTrigger className="w-36 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>{t(`status_${s}` as "status_planning")}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Link href={`/opportunities/${a.opportunityId}`}>
                <Button size="icon" variant="ghost"><ExternalLink className="h-4 w-4" /></Button>
              </Link>
              <Button size="icon" variant="ghost" onClick={() => onDelete(a.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </Card>
          ))}
        </div>
      )}

      <Card className="mt-8 p-6 bg-gradient-to-br from-accent/10 to-amber-100/40 border-accent/30">
        <div className="flex items-start gap-3">
          <Sparkles className="h-6 w-6 text-accent shrink-0 mt-1" />
          <div>
            <h3 className="font-bold mb-1">
              {lang === "ar" ? "أتمتة المتابعة (Premium)" : "Automated Tracking (Premium)"}
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              {lang === "ar"
                ? "تذكيرات بالمواعيد، تحديث تلقائي للحالات، تقارير دورية لأدائك."
                : "Deadline reminders, auto status updates, performance reports."}
            </p>
            <Link href="/premium">
              <Button size="sm" variant="outline">
                {lang === "ar" ? "اعرف المزيد" : "Learn more"}
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}

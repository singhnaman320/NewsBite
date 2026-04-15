import type { Article } from "../../types";

type ArticleCardProps = {
  article: Article;
  saved: boolean;
  onToggleSave: (articleId: string) => Promise<void>;
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

export const ArticleCard = ({
  article,
  saved,
  onToggleSave,
}: ArticleCardProps) => {
  return (
    <article className="glass-card overflow-hidden rounded-[2rem]">
      {article.imageUrl ? (
        <img
          src={article.imageUrl}
          alt={article.title}
          className="h-48 w-full object-cover"
        />
      ) : (
        <div className="h-48 bg-gradient-to-br from-accent/20 via-white to-pine/20" />
      )}
      <div className="space-y-4 p-5">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          <span className="rounded-full bg-slate-100 px-2 py-1">
            {article.sourceName}
          </span>
          <span>{article.topic}</span>
          <span>{article.category}</span>
        </div>

        <div className="space-y-3">
          <h3 className="text-2xl leading-tight">{article.title}</h3>
          <p className="line-clamp-3 text-sm leading-6 text-slate-600">
            {article.description || article.contentSnippet}
          </p>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
              Published
            </p>
            <p className="text-sm text-slate-600">
              {formatDate(article.publishedAt)}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onToggleSave(article._id)}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${saved ? "bg-pine text-white" : "bg-slate-100 text-slate-700"}`}
            >
              {saved ? "Saved" : "Save"}
            </button>
            <a
              href={article.link}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white"
            >
              Read story
            </a>
          </div>
        </div>
      </div>
    </article>
  );
};

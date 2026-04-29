import type { ResponsibleLinksMap } from '../lib/loadSolutionsFromCsv';

type ResponsibleNamesProps = {
  responsible: string;
  responsibleLinks: ResponsibleLinksMap;
  className?: string;
  linkClassName?: string;
};

function normalizePersonName(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function ResponsibleNames({
  responsible,
  responsibleLinks,
  className,
  linkClassName,
}: ResponsibleNamesProps) {
  const names = responsible
    .split(';')
    .map((name) => name.trim())
    .filter(Boolean);

  return (
    <span className={className}>
      {names.map((name, index) => {
        const link = responsibleLinks[normalizePersonName(name)];
        return (
          <span key={`${name}-${index}`}>
            {index > 0 && '; '}
            {link ? (
              <a
                href={link}
                target="_blank"
                rel="noreferrer noopener"
                className={
                  linkClassName ??
                  'text-primary underline underline-offset-2 decoration-primary/60 hover:text-primary-dim'
                }
                title={`Abrir conversa no Slack com ${name}`}
              >
                {name}
              </a>
            ) : (
              name
            )}
          </span>
        );
      })}
    </span>
  );
}

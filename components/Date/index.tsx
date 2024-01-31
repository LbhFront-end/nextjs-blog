import { parseISO, format } from 'date-fns';

interface DateProps {
  dateString: string;
  title: string;
}

export default function Date({ dateString, ...rest }: DateProps) {
  const date = parseISO(dateString);
  return (
    <time dateTime={dateString} {...rest}>
      {format(date, 'LLLL d, yyyy')}
    </time>
  );
}

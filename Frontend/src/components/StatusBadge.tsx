import type { StatusOS } from '../types';
import { formatStatus } from '../utils/status';

export default function StatusBadge({ status }: { status: StatusOS }) {
  return <span className={`status-badge status-${status}`}>{formatStatus(status)}</span>;
}

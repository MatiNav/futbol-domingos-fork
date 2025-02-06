import Matches from "../components/Matches";
import { getLatestMatchNumber } from "../utils/server/matches";

export default async function MatchesPage() {
  const maxMatchNumber = await getLatestMatchNumber();
  return <Matches maxMatchNumber={maxMatchNumber} />;
}

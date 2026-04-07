import type { Direction, EndingType, EventFlag, ItemId, JournalId } from "./types";

export const APP_NAME = "Shadow Ledger";
export const SAVE_KEY = "shadow-ledger-save";
export const SAVE_VERSION = 1;

export const VIEWPORT_COLUMNS = 7;
export const VIEWPORT_ROWS = 7;
export const CHASE_MAX_DISTANCE = 10;

export const DIRECTIONS: Direction[] = ["up", "left", "right", "down"];

export const ALL_ITEM_IDS: ItemId[] = [
  "visitor-pass",
  "ward-key",
  "prayer-slip",
  "rosary-beads",
  "patient-tag",
  "ledger-fragment"
];

export const ALL_JOURNAL_IDS: JournalId[] = [
  "voicemail-transcript",
  "patient-list",
  "accident-report",
  "mio-chart",
  "nurse-confession",
  "blood-ledger"
];

export const ALL_EVENT_FLAGS: EventFlag[] = [
  "introSeen",
  "foyerPhoneSeen",
  "visitorPassTaken",
  "corridorEntered",
  "archiveEntered",
  "archiveCodeSolved",
  "patientListRead",
  "accidentReportRead",
  "chartRead",
  "wardDoorUnlocked",
  "wardEntered",
  "wardCabinetSolved",
  "patientTagTaken",
  "ledgerFragmentTaken",
  "confessionRead",
  "prayerSlipTaken",
  "rosaryTaken",
  "chaseStarted",
  "chaseCompleted",
  "hidFromNurse",
  "stairwellEntered",
  "basementUnlocked",
  "basementEntered",
  "payphoneChanged",
  "bloodLedgerRead",
  "endingRelease",
  "endingInheritance",
  "endingSilence"
];

export const ALL_ENDINGS: EndingType[] = ["release", "inheritance", "silence"];

export const ITEM_FLAG_MAP: Partial<Record<ItemId, EventFlag>> = {
  "visitor-pass": "visitorPassTaken",
  "prayer-slip": "prayerSlipTaken",
  "rosary-beads": "rosaryTaken",
  "patient-tag": "patientTagTaken",
  "ledger-fragment": "ledgerFragmentTaken"
};

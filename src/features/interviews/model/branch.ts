import { computed, ref } from "vue";
import type { Position } from "../../../shared/types";
import { findPerson } from "../lib/transcript";
export function createBranch() {
  const personId = ref<string | null>(null),
    returnPoint = ref<Position | null>(null),
    paragraph = ref(0);
  const person = computed(() =>
    personId.value ? findPerson(personId.value) : undefined,
  );
  /**
   * Enter an interview. The first entry records where the main story should
   * resume; switching between people while already in an interview only
   * changes who is being heard and must not overwrite that return point.
   */
  function enter(id: string, position: Position) {
    if (!findPerson(id)) return false;
    if (!personId.value) returnPoint.value = structuredClone(position);
    personId.value = id;
    paragraph.value = 0;
    return true;
  }
  /** Leave the current interview and consume the return point. */
  function leave() {
    const point = returnPoint.value;
    personId.value = null;
    returnPoint.value = null;
    paragraph.value = 0;
    return point;
  }
  /** Abandon any interview and its return relationship without resuming it. */
  function dismiss() {
    personId.value = null;
    returnPoint.value = null;
    paragraph.value = 0;
  }
  return { personId, returnPoint, paragraph, person, enter, leave, dismiss };
}
export type Branch = ReturnType<typeof createBranch>;

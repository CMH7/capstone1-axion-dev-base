<script>
  import SubjectBox from "$lib/components/interface-components/Subject-box.svelte";
  import subjects from "$lib/sample-case/sample-subjects/subjects";

  // Transition
  import { fade } from 'svelte/transition';
 
  let allSubjects = subjects.subjects;
</script>

<div class="columns is-multiline is-variable is-5 pl-6">
  {#each allSubjects as subject}
    <div in:fade class="column is-narrow">
      <SubjectBox name={subject.name} color={subject.color} isFavorite={subject.isFavorite} />
    </div>
  {/each}
</div>
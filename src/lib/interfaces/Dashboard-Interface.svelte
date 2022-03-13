<script>
import SubjectBox from "$lib/components/interface-components/Subject-box.svelte";
import subjects from "$lib/sample-case/sample-subjects/subjects";

let allSubjects = subjects.subjects;
</script>

<div class="hero">
  <div class="hero-head px-3">
    <p class="mb-0 quicksands is-size-1-tablet is-size-2-mobile has-text-weight-bold has-text-info">
      Subjects
    </p>
  </div>
  <div class="hero-body">
    <div class="columns is-multiline is-variable is-5 pl-6">
      {#each allSubjects as subject}
        <div class="column is-narrow">
          <SubjectBox name={subject.name} color={subject.color} isFavorite={subject.isFavorite}/>
        </div>
      {/each}
    </div>
  </div>
</div>
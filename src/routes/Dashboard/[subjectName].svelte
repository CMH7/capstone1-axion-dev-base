<script context='module'>
  export async function load({params, fetch}) {
    const SubjectName = params.subjectName
    const res = await fetch(`https://axion-back.herokuapp.com/MainApp/${SubjectName}`)
    const subject = await res.json()

    if(res.ok) {
      return {
        props: {
          subject
        }
      }
    }

    return {
      status: res.status,
      error: new Error('Could not fetch the subject')
    }
  }
</script>

<script>
  export let subject
</script>

<div class="section has-background-danger">
  <div class="container has-text-centered has-background-success">
    {subject.data}
    {subject.error}
    {subject.message}
  </div>
</div>
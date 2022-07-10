<script>
  import { Avatar } from 'svelte-materialify'
  // @ts-ignore
  import Skeleton from 'svelte-skeleton/Skeleton.svelte'
</script>

<div class="box shadow-inside-default p-4 is-flex is-align-items-center is-justify-content-space-between">
  <div class="is-flex is-align-items-center">
    <div class="is-clickable">
      <Skeleton height={35} width={35} >
        <circle cx={17} cy={17} r={17}/>
      </Skeleton>
    </div>
    <div
      class="ml-4 dm-sans text-body-2 is-clickable"
    >
      <Skeleton height={17} width={200}>
        <rect width={200} height={17} />
      </Skeleton>
    </div>
  </div>
  <div class="is-size-7 is-clickable">
    <Skeleton width={30} height={17}>
      <rect width={30} height={17} />
    </Skeleton>
  </div>
</div>
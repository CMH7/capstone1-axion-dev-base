<script>
  import { Avatar } from 'svelte-materialify'
  // @ts-ignore
  import Skeleton from 'svelte-skeleton/Skeleton.svelte'
</script>

<div class="box shadow-inside-default p-4 is-flex is-align-items-center is-justify-content-space-between">
  <div class="is-flex is-align-items-center">
    <div class="is-clickable">
      <Skeleton height={40} width={40} >
        <circle cx={20} cy={20} r={20}/>
      </Skeleton>
    </div>
    <div
      class="ml-4 dm-sans text-body-2 is-clickable"
    >
      <Skeleton height={20} width={200}>
        <rect width={200} height={20} />
      </Skeleton>
    </div>
  </div>
  <div class="is-size-7 is-clickable">
    <Skeleton width={30} height={20}>
      <rect width={30} height={20} />
    </Skeleton>
  </div>
</div>
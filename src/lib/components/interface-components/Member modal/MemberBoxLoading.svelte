<script>
  // @ts-ignore
  import Skeleton from 'svelte-skeleton/Skeleton.svelte'
  let outerWidth
</script>

<svelte:window bind:outerWidth />

<div class="box shadow-inside-default maxmins-h-60 mx-1 my-1 p-{outerWidth < 483 ? '2' : '4'} is-flex is-align-items-center is-justify-content-space-between has-transition hover-bg-grey-lighter maxmins-w-{outerWidth < 853 && outerWidth > 375 ? '300' : outerWidth < 376 ? '230' : '350'}">
  <!-- profile and infos -->
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

  <!-- action button -->
  <div class="is-size-7 is-clickable">
    <Skeleton width={30} height={17}>
      <rect width={30} height={17} />
    </Skeleton>
  </div>
</div>
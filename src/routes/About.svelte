<script>
  import HomeFooter from "$lib/components/Home-footer.svelte";
  import HomeHeader from "$lib/components/Home-header.svelte";
  import Button from "$lib/components/Button.svelte";
</script>

<!-- header -->
<HomeHeader/>
<div class="hero is-fullheight-with-navbar">
  <div class="hero head m-6"> 
    
    <p class="mt-3 mb-10 is-size-1-tablet is-size-3-mobile is-primary has-text-weight-bold has-text-centered fredokaone">ABOUT</p>
    
    <p class="mt-5 mb-7 is-size-3-tablet is-size-3-mobile is-primary has-text-weight-bold has-text-centered dm-sans">What is Axion?</p>

    <!-- Paragraphs/Texts about Axion -->
    <p class="mb-2 is-size-6-tablet is-size-3-mobile is-primary has-text-centered dm-sans">Axion is an application that helps college students handle their schoolworks with style. ✨</p>

    <p class="mb-2 is-size-6-tablet is-size-3-mobile is-primary has-text-centered dm-sans">Whether it is for individual work or group activities, Axion got you covered.</p>

    <p class="mb-4 is-size-6-tablet is-size-3-mobile is-primary has-text-centered dm-sans">As for now, these are sample paragraphs made by Yaz for testing purposes only. He will enhance these soon. </p>

    <!-- 'Get Started' button (leads to Sign Up) -->
    <div class="is-flex flex-column is-align-items-center">
      <div class="mt-5 mb-10">
        <Button type="primary" text="Get Started" href="/MainApp" textcss="dm-sans has-text-weight-bold is-size-5" on:click/>
      </div>
    </div>
  </div>

  
  <!-- Greyish background -->
  <div class="hero head px-6 py-6 has-background-light is-centered"> 

    <!-- 1st feature (image sa left, text sa right) -->
    <div class="columns mt-5 mb-6 py-5 is-mobile is-multiline">
      
      <!-- Image -->
      <div class="column pl-5 is-7-tablet is-5-mobile has-background-light">
        <figure class="image is-2by1">
          <img style="border-radius: 10%" class="pl-5" src="https://www.ntaskmanager.com/wp-content/uploads/2021/02/Task-management-vs-project-management.jpg" alt="A picture about managing of tasks.">
        </figure>
      </div>

      <!-- Supporting text -->
      <div class="column py-is-7-tablet is-5-mobile has-background-light">
        <p class="px-5 is-size-4-tablet is-size-3-mobile is-primary has-text-centered dm-sans">1: This is a supporting paragpraph for Axion's feature of managing tasks. Again, to be enhanced by Yaz. </p>
      </div>
    </div>

    
    <!-- 2nd feature (text sa left, image sa right) -->
    <div class="columns my-6 py-5 is-mobile is-multiline">

      <!-- Supporting text -->
      <div class="column py-is-7-tablet is-5-mobile has-background-light">
        <p class="px-5 is-size-4-tablet is-size-3-mobile is-primary has-text-centered dm-sans">2: This is a supporting paragpraph for Axion's feature of emphasizing the most urgent and prioritized tasks. Again, to be enhanced by Yaz. </p>
      </div>
      
      <!-- Image -->
      <div class="column pl-5 is-7-tablet is-5-mobile has-background-light">
        <figure class="image is-2by1">
          <img style="border-radius: 10%" class="pl-5" src="https://www.ntaskmanager.com/wp-content/uploads/2021/02/Task-management-vs-project-management.jpg" alt="A picture about managing of tasks.">
        </figure>
      </div>
    </div>

    
    <!-- 3rd feature -->
    <div class="columns mt-5 mb-6 py-5 is-mobile is-multiline">
      
      <!-- Image -->
      <div class="column pl-5 is-7-tablet is-5-mobile has-background-light">
        <figure class="image is-2by1">
          <img style="border-radius: 10%" class="pl-5" src="https://www.ntaskmanager.com/wp-content/uploads/2021/02/Task-management-vs-project-management.jpg" alt="A picture about managing of tasks.">
        </figure>
      </div>

      <!-- Supporting text -->
      <div class="column py-is-7-tablet is-5-mobile has-background-light">
        <p class="px-5 is-size-4-tablet is-size-3-mobile is-primary has-text-centered dm-sans">3: Inviting members and data collab. Again, to be enhanced by Yaz. </p>
      </div>
    </div>

    
    <!-- 4th feature  -->
    <div class="columns mt-5 mb-6 py-5 is-mobile is-multiline">
      
      <!-- Image -->
      <div class="column pl-5 is-7-tablet is-5-mobile has-background-light">
        <figure class="image is-2by1">
          <img style="border-radius: 10%" class="pl-5" src="https://www.ntaskmanager.com/wp-content/uploads/2021/02/Task-management-vs-project-management.jpg" alt="A picture about managing of tasks.">
        </figure>
      </div>

      <!-- Supporting text -->
      <div class="column py-is-7-tablet is-5-mobile has-background-light">
        <p class="px-5 is-size-4-tablet is-size-3-mobile is-primary has-text-centered dm-sans">4: Kanban board. Again, to be enhanced by Yaz. </p>
      </div>
    </div>
    
    
    <!-- 5th feature  -->
    <div class="columns my-6 py-5 is-mobile is-multiline">

      <!-- Supporting text -->
      <div class="column py-is-7-tablet is-5-mobile has-background-light">
        <p class="px-5 is-size-4-tablet is-size-3-mobile is-primary has-text-centered dm-sans">5: Calendar view. Again, to be enhanced by Yaz. </p>
      </div>
      
      <!-- Image -->
      <div class="column pl-5 is-7-tablet is-5-mobile has-background-light">
        <figure class="image is-2by1">
          <img style="border-radius: 10%" class="pl-5" src="https://www.ntaskmanager.com/wp-content/uploads/2021/02/Task-management-vs-project-management.jpg" alt="A picture about managing of tasks.">
        </figure>
      </div>
    </div>


    <!-- 6th & 7th feature -->
    <div class="columns mt-5 mb-6 py-5 is-mobile is-multiline">
      
      <!-- Image -->
      <div class="column pl-5 is-7-tablet is-5-mobile has-background-light">
        <figure class="image is-2by1">
          <img style="border-radius: 10%" class="pl-5" src="https://www.ntaskmanager.com/wp-content/uploads/2021/02/Task-management-vs-project-management.jpg" alt="A picture about managing of tasks.">
        </figure>
      </div>

      <!-- Supporting text -->
      <div class="column py-is-7-tablet is-5-mobile has-background-light">
        <p class="px-5 is-size-4-tablet is-size-3-mobile is-primary has-text-centered dm-sans">6: Favorites and 7: Assigned to me. Again, to be enhanced by Yaz. </p>
      </div>
    </div>
    
  </div>

  <div class="hero head m-6"> 
    <p class="mt-5 mb-3 is-size-4-tablet is-size-3-mobile is-primary has-text-weight-bold has-text-centered dm-sans">Managing your academic work here in Axion is simple and easy.</p>

    <!-- 'Get Started' button (leads to Sign Up) -->
    <div class="is-flex flex-column is-align-items-center">
      <div class="mt-3 mb-10">
        <Button type="primary" text="Get Started" href="/MainApp" textcss="dm-sans has-text-weight-bold is-size-5" on:click/>
      </div>
    </div>
  </div>
  
  <div class="hero-foot">
    <HomeFooter/>
  </div>

</div>


<script>
  import HomeFooter from "$lib/components/Home-footer.svelte";
  import HomeHeader from "$lib/components/Home-header.svelte";
  import Button from "$lib/components/Button.svelte";
  import { Tabs, Tab, Window, WindowItem, AppBar, MaterialApp } from "svelte-materialify";

  let value = 0;
</script>
<MaterialApp>
  
<!-- header -->
<HomeHeader/>
<div class="hero is-fullheight-with-navbar">
  <div class="hero head m-6"> 
    <!--Title-->
    <p class="mt-5 mb-7 is-size-2-tablet is-size-3-mobile is-primary has-text-weight-bold has-text-centered dm-sans">What is Axion?</p>

    <!-- Paragraphs/Texts about Axion -->
    <p class="mb-2 is-size-4-tablet is-size-5-mobile is-primary has-text-centered dm-sans">Axion is a task management application meant to fit with the academic setting of college students- for them to manage their tasks and help them achieve better output.</p>

    <!-- 'Get Started' button (leads to Sign Up) -->
    <div class="is-flex flex-column is-align-items-center">
      <div class="mt-6 mb-10 py-6">
        <Button type="primary" text="Get Started" href="/Signup" textcss="dm-sans has-text-weight-bold is-size-6" on:click/>
      </div>
    </div>
  </div>

  
  <!-- Greyish background -->
  <div class="hero head px-6 py-6 has-background-light is-centered"> 

    <!-- 1st feature (image sa left, text sa right) -->
    <div class="column is-flex is-justify-content-center is-multiline">
      <!-- Image -->
      <div class="column is-6-tablet is-7-mobile has-background-light">
        <figure class="image is-2by1">
          <img class="" src="https://www.ntaskmanager.com/wp-content/uploads/2021/02/Task-management-vs-project-management.jpg" alt="A picture about managing of tasks.">
        </figure>
      </div>

      <!-- Supporting text -->
      <div class="column is-flex-direction is-mobile is-justify-content-center is-multiline has-background-light">
        <p class="px-4 is-size-5-tablet is-size-7-mobile is-primary has-text-centered dm-sans"> In Axion, you can organize your tasks in your own productive workspace.</p>
      </div>
    </div>
    
    <!-- 2nd feature (text sa left, image sa right) -->
    <div class="column is-flex is-justify-content-center is-mobile is-multiline">

      <!-- Supporting text -->
      <div class=" d-flex flex-wrap">
      <div class="column py-is-7-tablet is-5-mobile has-background-light">
        <p class="px-4 is-size-5-tablet is-size-7-mobile is-primary has-text-centered dm-sans">Axion has an automated function that puts emphasis on tasks that are most urgent and most prioritized- so that you can see them before other tasks, right away.</p>
      </div>
      </div>

      <!-- Image -->
      <div class="column is-6-tablet is-7-mobile has-background-light">
        <figure class="image is-2by1">
          <img class="is-justify-content-end" src="https://www.ntaskmanager.com/wp-content/uploads/2021/02/Task-management-vs-project-management.jpg" alt="A picture about managing of tasks.">
        </figure>
      </div>
    </div>

    
    <!-- 3rd feature -->
    <div class="column is-flex is-justify-content-center is-multiline">
      
      <!-- Image -->
      <div class="column is-6-tablet is-7-mobile has-background-light">
        <figure class="image is-2by1">
          <img class="" src="https://www.ntaskmanager.com/wp-content/uploads/2021/02/Task-management-vs-project-management.jpg" alt="A picture about managing of tasks.">
        </figure>
      </div>

      <!-- Supporting text -->
      <div class="column is-flex is-justify-content-center is-multiline has-background-light">
        <p class="px-4 is-size-5-tablet is-size-7-mobile is-primary has-text-centered dm-sans">Invite your co-members for group activities and let data synchronize across your screens.</p>
      </div>
    </div>

    <!-- text (feature)-->
    
      <AppBar>
        <Tabs grow class="primary" bind:value fixedTabs>
          <div slot="tabs">
            <Tab>Kanban</Tab>
            <Tab>Calendar</Tab>
            <Tab>favorites</Tab>
            <Tab>item 4</Tab>
          </div>
        </Tabs>
      </AppBar>
      
      <Window {value} class="ma-4">
        <WindowItem>
          <h4>Kanban</h4>
            <!-- 1st feature (image sa left, text sa right) -->
            <div class="column is-flex is-justify-content-center is-multiline">
              
              <!-- Image -->
              <div class="column is-6-tablet is-7-mobile has-background-light">
                <figure class="image is-2by1">
                  <img class="" src="https://www.ntaskmanager.com/wp-content/uploads/2021/02/Task-management-vs-project-management.jpg" alt="A picture about managing of tasks.">
                </figure>
              </div>

              <!-- Supporting text -->
              <div class="column is-flex is-justify-content-center is-multiline has-background-light">
                <p class="px-4 is-size-5-tablet is-size-7-mobile is-primary has-text-centered dm-sans"> See how the Kanban board indicates the progress of your tasks.</p>
              </div>
            </div>
        </WindowItem>
        <WindowItem>
          <h4>Calendar</h4>
            <!-- 1st feature (image sa left, text sa right) -->
            <div class="column is-flex is-justify-content-center is-multiline">
              
              <!-- Image -->
              <div class="column is-6-tablet is-7-mobile has-background-light">
                <figure class="image is-2by1">
                  <img class="" src="https://www.ntaskmanager.com/wp-content/uploads/2021/02/Task-management-vs-project-management.jpg" alt="A picture about managing of tasks.">
                </figure>
              </div>

              <!-- Supporting text -->
              <div class="column is-flex is-justify-content-center is-multiline has-background-light">
                <p class="px-4 is-size-5-tablet is-size-7-mobile is-primary has-text-centered dm-sans"> In Axion, you can organize your tasks in your own productive workspace.</p>
              </div>
            </div>
        </WindowItem>
        <WindowItem>
          <h4>Favorites</h4>
            <!-- 1st feature (image sa left, text sa right) -->
            <div class="column is-flex is-justify-content-center is-multiline">
              
              <!-- Image -->
              <div class="column is-6-tablet is-7-mobile has-background-light">
                <figure class="image is-2by1">
                  <img class="" src="https://www.ntaskmanager.com/wp-content/uploads/2021/02/Task-management-vs-project-management.jpg" alt="A picture about managing of tasks.">
                </figure>
              </div>

              <!-- Supporting text -->
              <div class="column is-flex-direction-row is-justify-content-center is-multiline has-background-light">
                <p class="px-4 is-size-5-tablet is-size-7-mobile is-primary has-text-centered dm-sans"> In Axion, you can organize your tasks in your own productive workspace.</p>
              </div>
            </div>
        </WindowItem>
        <WindowItem>
          <h4>Item 4</h4>
            <!-- 1st feature (image sa left, text sa right) -->
            <div class="column is-flex is-justify-content-center is-multiline">
              
              <!-- Image -->
              <div class="column is-6-tablet is-7-mobile has-background-light">
                <figure class="image is-2by1">
                  <img class="" src="https://www.ntaskmanager.com/wp-content/uploads/2021/02/Task-management-vs-project-management.jpg" alt="A picture about managing of tasks.">
                </figure>
              </div>

              <!-- Supporting text -->
              <div class="column is-flex is-justify-content-center is-multiline has-background-light">
                <p class="px-4 is-size-5-tablet is-size-7-mobile is-primary has-text-centered dm-sans"> In Axion, you can organize your tasks in your own productive workspace.</p>
              </div>
            </div>
        </WindowItem>
      </Window>

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
</MaterialApp>
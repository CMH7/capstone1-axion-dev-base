<script>
    import HomeFooter from "$lib/components/Home-footer.svelte";
    import SignupHeader from "./Signup-header.svelte";
  </script>
  
  <SignupHeader/>
  <div class="hero is-fullheight-with-navbar">
    <div class="hero-head">
      <div class="container">
        <div class="columns is-mobile is-centered is-multiline">
  
            <div class="column is-5-desktop is-12-touch">
                <div class="container m-5 is-flex is-flex-direction-column is-justify-content-space-between is-align-items-center">
                  <p class="is-size-1-tablet is-size-3-mobile Dm Sans has-text-black has-text-weight-bold has-text-centered-touch">SIGN UP</p>
                </div>

          <div class="level-left is-align-start">
          <div class="column is-7-desktop is-10-touch">
              <div class="container">
                <input class="input quicksands has-text-white has-background-light" style="width: 200%;" type="text" placeholder="Full Name">
                <input class="input quicksands my-3 has-text-white has-background-light" style="width: 45%;" type="text" placeholder="Age"><input class="input quicksands ml-3 my-3 has-text-white has-background-light" style="width: 50%;" type="text" placeholder="Gender">
                <input class="input quicksands has-text-white has-background-light" style="width: 200%;" type="text" placeholder="School/University">
                <input class="input quicksands my-3 has-text-white has-background-light" style="width: 200%;" type="text" placeholder="Course/Year">
              </div>
              </div>
              
          <div class="column is-7-desktop is-12-touch">
              <div class="level-right">
                <div class="container ">
                <input class="input quicksands has-text-white has-background-light" style="width: 200%;" type="text" placeholder="Email">
                <input class="input quicksands my-3 has-text-white has-background-light" style="width: 200%;" type="text" placeholder="Username">
                <input class="input quicksands has-text-white has-background-light" style="width: 200%;" type="text" placeholder="Password">
                <input class="input quicksands my-3 has-text-white has-background-light" style="width: 200%;" type="text" placeholder="Confirm Password">
                </div>
                </div>
                </div>
          </div>
      </div>
        </div>
        </div>
    </div>
  
    <div class="hero-foot">
      <HomeFooter/>
    </div>
  </div>
  
  <style>

  </style>



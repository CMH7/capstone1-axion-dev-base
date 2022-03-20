<script>
  import { mdiGoogle, mdiFacebook } from '@mdi/js'; // icons used
  import { Icon, MaterialApp } from 'svelte-materialify';
  import HomeFooter from "../lib/components/Home-footer.svelte";
  import HomeHeader from "../lib/components/Home-header.svelte";
</script>

<!-- header -->
<HomeHeader/>
<div class="hero is-fullheight-with-navbar">
  <div class="hero head m-6">
    <p class="mt-3 mb-10 is-size-1-tablet is-size-3-mobile is-primary has-text-weight-bold has-text-centered fredokaone">CONTACTS</p>
    <div class="columns is-mobile is-centered is-multiline">
      
      <!-- 1st column: CM -->
      <div class="column is-3-tablet is-8-mobile">
        <div class="p-1 has-background-info-dark">
          <div class="py-3 px-5 has-background-white">

            <!-- image -->
            <figure class="image is-square">
              <img class="is-rounded p-5" src="https://p.favim.com/orig/2018/08/20/wtf-fire-laugh-Favim.com-6178168.jpg" alt="A portrait of Charles Maverick Herrera.">
            </figure>

            <!-- contact info -->
            <div>
              <p class="has-text-centered fredokaone">
                Charles Maverick Herrera
                <br>
                <small class="has-text-weight-normal is-family-secondary">
                  Developer
                </small>
              </p>
            </div>

            <!-- icons -->
            <div class="mt-8 is-flex is-justify-content-center">
              <div class="mx-2">
                <MaterialApp>
                  <a href="http://facebook.com/" target="_blank">
                    <Icon class="has-text-info" size="32px" path={mdiFacebook} />
                  </a>
                </MaterialApp>
              </div>
              <div class="mx-2">
                <MaterialApp>
                  <a href="http://gmail.com/" target="_blank">
                    <Icon class="has-text-danger-dark" size="32px" path={mdiGoogle} />
                  </a>
                </MaterialApp>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 2nd column: Joanne -->
      <div class="column is-3-tablet is-8-mobile">
        <div class="p-1 has-background-info-dark">
          <div class="py-3 px-5 has-background-white">

            <!-- image -->
            <figure class="image is-square">
              <img class="is-rounded p-5" src="https://i.pinimg.com/736x/75/66/40/7566407575a0b7f1bf77b6d2af37a3de.jpg" alt="A portrait of Joanne Razelle L. Roche.">
            </figure>

            <!-- contact info -->
            <div>
              <p class="has-text-centered fredokaone">
                Joanne Razelle L. Roche
                <br>
                <small class="has-text-weight-normal is-family-secondary">
                  Developer
                </small>
              </p>
            </div>

            <!-- icons -->
            <div class="mt-8 is-flex is-justify-content-center">
              <div class="mx-2">
                <MaterialApp>
                  <a href="http://facebook.com/" target="_blank">
                    <Icon class="has-text-info" size="32px" path={mdiFacebook} />
                  </a>
                </MaterialApp>
              </div>
              <div class="mx-2">
                <MaterialApp>
                  <a href="http://gmail.com/" target="_blank">
                    <Icon class="has-text-danger-dark" size="32px" path={mdiGoogle} />
                  </a>
                </MaterialApp>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 3rd column: Yaz -->
      <div class="column is-3-tablet is-8-mobile">
        <div class="p-1 has-background-info-dark">
          <div class="py-3 px-5 has-background-white">

            <!-- image -->
            <figure class="image is-square">
              <img class="is-rounded p-5" src="https://scontent.fcrk1-3.fna.fbcdn.net/v/t1.6435-9/131424560_106394784688547_3923325576650902108_n.jpg?_nc_cat=105&ccb=1-5&_nc_sid=8bfeb9&_nc_eui2=AeGlsTiK0PorW5mE0t-IYDAcsKSSbiBIGd-wpJJuIEgZ36sQffHt8areraZKQewNz9t_o2vsIx3RGx2piC42PQyW&_nc_ohc=ZjrgTFDp0x4AX9_0dNi&_nc_ht=scontent.fcrk1-3.fna&oh=00_AT9c8KQgbRRPgYmdKKYQDd_I7spMvHOpswrLlvwGFiuTuw&oe=625B4395" alt="A portrait of Mart Yazen Mikhail Clarin.">
            </figure>

            <!-- contact info -->
            <div>
              <p class="has-text-centered fredokaone">
                Mart Yazen Mikhail Clarin
                <br>
                <small class="has-text-weight-normal is-family-secondary">
                  Developer
                </small>
              </p>
            </div>

            <!-- icons -->
            <div class="mt-8 is-flex is-justify-content-center">
              <div class="mx-2">
                <MaterialApp>
                  <a href="http://facebook.com/" target="_blank">
                    <Icon class="has-text-info" size="32px" path={mdiFacebook} />
                  </a>
                </MaterialApp>
              </div>
              <div class="mx-2">
                <MaterialApp>
                  <a href="http://gmail.com/" target="_blank">
                    <Icon class="has-text-danger-dark" size="32px" path={mdiGoogle} />
                  </a>
                </MaterialApp>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 4th column: El John -->
      <div class="column is-3-tablet is-8-mobile">
        <div class="p-1 has-background-info-dark">
          <div class="py-3 px-5 has-background-white">

            <!-- image -->
            <figure class="image is-square">
              <img class="is-rounded p-5" src="https://i.pinimg.com/736x/ed/e5/1d/ede51d341376f0505aca72dc49b4c653.jpg" alt="A portrait of El John S. Matimtim.">
            </figure>

            <!-- contact info -->
            <div>
              <p class="has-text-centered fredokaone">
                El John S. Matimtim
                <br>
                <small class="has-text-weight-normal is-family-secondary">
                  Developer
                </small>
              </p>
            </div>

            <!-- icons -->
            <div class="mt-8 is-flex is-justify-content-center">
              <div class="mx-2">
                <MaterialApp>
                  <a href="http://facebook.com/" target="_blank">
                    <Icon class="has-text-info" size="32px" path={mdiFacebook} />
                  </a>
                </MaterialApp>
              </div>
              <div class="mx-2">
                <MaterialApp>
                  <a href="http://gmail.com/" target="_blank">
                    <Icon class="has-text-danger-dark" size="32px" path={mdiGoogle} />
                  </a>
                </MaterialApp>
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


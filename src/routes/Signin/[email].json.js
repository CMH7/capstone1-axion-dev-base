export async function get({ params, fetch, error }) {
  const email = params.email
  const res = await fetch(`https://axion-back.herokuapp.com/Signin?email=${email}`)
  const { password } = await res.json()

  if (res.ok) {
    return {
      props: {
        password
      }
    }
  }

  return {
    message: error.message
  }
}
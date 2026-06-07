async function sendResetEmail() {

const email =
        document.getElementById(
                "email"
        ).value;

try {

    const response =
            await fetch(
                    "/api/users/forgot-password",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                    "application/json"
                        },

                        body: JSON.stringify({
                            email: email
                        })
                    }
            );

    const message =
            document.getElementById(
                    "message"
            );

    if (response.ok) {

        message.innerText =
                "Password reset email sent. Check your inbox.";

    } else {

        message.innerText =
                "Unable to send reset email.";
    }

} catch (error) {

    console.error(error);

    document.getElementById(
            "message"
    ).innerText =
            "Something went wrong.";
}


}

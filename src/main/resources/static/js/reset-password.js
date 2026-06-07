function getToken() {


const params =
        new URLSearchParams(
                window.location.search
        );

return params.get(
        "token"
);


}

async function resetPassword() {


const token =
        getToken();

const newPassword =
        document.getElementById(
                "newPassword"
        ).value;

try {

    const response =
            await fetch(
                    "/api/users/reset-password",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                    "application/json"
                        },

                        body: JSON.stringify({
                            token: token,
                            newPassword: newPassword
                        })
                    }
            );

    const message =
            document.getElementById(
                    "message"
            );

    if (response.ok) {

        message.innerText =
                "Password reset successful. You can now login.";

    } else {

        message.innerText =
                "Invalid or expired reset token.";
    }

} catch (error) {

    console.error(error);

    document.getElementById(
            "message"
    ).innerText =
            "Something went wrong.";
}


}

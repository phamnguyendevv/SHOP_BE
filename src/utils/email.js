let email = {
    checkEmail: async (email) => {
        try {
            const re = /\S+@\S+\.\S+/;
            return re.test(email);
        } catch (error) {
            throw error;
        }
    }
    // send email
    // verify email

    
}

export default email;
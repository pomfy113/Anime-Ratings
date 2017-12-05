// Utilities

module.exports = {
    checklog: (page, user) => {
        // If user exists, return the "(pagename) logged",
        // else return "(pagename)"
        return user ? page + " logged" : page
    }

}

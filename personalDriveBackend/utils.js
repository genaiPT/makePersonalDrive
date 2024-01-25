function getActiveUserName(USERS, userId){
   let userObject = USERS.find((user) => user.id === userId.id);
   return userObject.name

}
module.exports = {getActiveUserName}
from project_users import users

def validateUser(id, key):
    return (id in users and users[id] == key)
         
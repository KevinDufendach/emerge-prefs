from project_users import users


def validate_user(user_id, key):
    return user_id in users and users[user_id] == key


from flask import Flask, jsonify, make_response, redirect, request
from flask_pymongo import PyMongo
from flask_cors import CORS
import hashlib

import pprint

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/userdb"

CORS(app)

mongo = PyMongo(app)

def remove_extra_fields(obj, fields_to_include):
    # Get the list of dictionary keuys
    obj_fields = list(obj.keys())   
    
    # Grab the symmetric difference between the two
    diff = set(fields_to_include).symmetric_difference(set(obj_fields))

    # Delete fields not in the inclusion list
    for fld in diff:
        del obj[fld]

    return obj

fields_to_include = ["name", "email", "pass", "userid" ]

@app.route('/users', methods=['GET'])
def users():

    users = mongo.db.users.find({})
    all_users = []

    for user in users:

        # Remove the extra fields
        updated_user = remove_extra_fields(user, fields_to_include)
        
        # Append the altered user
        all_users.append(user)
    
    return make_response(jsonify([user for user in all_users]), 200)

@app.route('/users/<int:userid>', methods=['GET'])
def get_user(userid):
    
    user = mongo.db.users.find_one({"userid" : userid })

    if user is None:
        return make_response(jsonify({}), 200)
    else:
        updated_user = remove_extra_fields(user, fields_to_include)
        return make_response(jsonify(updated_user), 200)

@app.route('/users/delete/<int:userid>', methods=['POST'])
def delete_user(userid):
    mongo.db.users.delete_one({ "userid" : userid })
    return redirect('http://localhost:8080/users')

@app.route('/users/edit/<int:userid>', methods=['POST'])
def edit_user(userid):

    mongo.db.users.update_one({ "userid" : userid }, { "$set": {
        "name": request.form['name'],
        "pass": hashlib.sha1(str(request.form['pass']).encode('utf-8')).hexdigest(),
        "email": request.form['email']
    }})

    return redirect('http://localhost:8080/users')

def get_max_userid():
    
    user = mongo.db.users.find({}).sort("userid", -1)
    
    if user.count() == 0:
        return 0
    else:
        cur_max_id = user.next()['userid']
        print("cur_max_id: " + str(cur_max_id))
        return cur_max_id

@app.route('/users/create', methods=['POST'])
def create_user():
    
    max_id = get_max_userid() + 1

    mongo.db.users.insert_one({
        "userid": max_id,
        "name": request.form['name'],
        "pass": hashlib.sha1(str(request.form['pass']).encode('utf-8')).hexdigest(),
        "email": request.form['email']
    })
    
    return redirect('http://localhost:8080/users')


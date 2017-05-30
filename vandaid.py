# Copyright 2013 Google, Inc
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#             http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import json
import webapp2
import logging
logging.basicConfig(filename='python_log.log', level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

import validate_user

# [START urllib-imports]
import urllib
# [END urllib-imports]

# [START urlfetch-imports]
from google.appengine.api import urlfetch
# [END urlfetch-imports]

from config import config

class RestHandler(webapp2.RequestHandler):

    def dispatch(self):
        # time.sleep(1)
        super(RestHandler, self).dispatch()

    def SendJson(self, r):
        self.response.headers['content-type'] = 'text/plain'
        self.response.write(json.dumps(r))

class RedcapGetFieldMetadataHandler(RestHandler):
    
    def post(self):
        url = config['api_url']
        
        form_fields = {
            'token' : config['api_token'],
            'content' : 'metadata',
            'format' : 'json',
            'returnFormat' : 'json'
        }
        
        try:
            form_data = urllib.urlencode(form_fields)
            headers = {'Content-Type': 'application/x-www-form-urlencoded',
                       'Accept' : 'application/json'}
            result = urlfetch.fetch(
                url=url,
                payload=form_data,
                method=urlfetch.POST,
                headers=headers)
            self.response.write(result.content)
        except urlfetch.Error:
            self.response.out.write('Caught exception fecthing url')
#             logging.exception('Caught exception fetching url')

class RedcapImportRecordsHandler(RestHandler):

    def post(self):
        url = config['api_url']

        r = json.loads(self.request.body)
        
        myUser = r['user']
        
        if not(validate_user.validateUser(myUser['id'], myUser['key'])):
#             logging.exception('Unauthorized user')
            self.response.out.write('Unauthorized user')
            return
                
        myFields = r['fields']
        
        apiFields = {
            'token': config['api_token'],
            'content': 'record',
            'format': 'json',
            'type': 'flat',
            'data': json.dumps([myFields]),
        }
        
        try:
            form_data = urllib.urlencode(apiFields)
            headers = {'Content-Type': 'application/x-www-form-urlencoded',
                       'Accept' : 'application/json'}
            result = urlfetch.fetch(
                url=url,
                payload=form_data,
                method=urlfetch.POST,
                headers=headers)
            self.response.write(result.content)
        except urlfetch.Error:
            logging.exception('Caught exception fetching url')

class RedcapExportRecordsHandler(RestHandler):

    def post(self):
        logging.debug('Beginning export handler')
        
        url = config['api_url']
        
        r = json.loads(self.request.body)
        
        
        
        try:
            myUser = r['user']
            myForm = r['formName']
            
            
            
            if not(validate_user.validateUser(myUser['id'], myUser['key'])):
                self.response.out.write('Unauthorized user')
                return
        except urlfetch.Error:
            logging.exception('Exception with authorizing user')
            
        apiFields = {
            'token': config['api_token'],
            'content': 'record',
            'format': 'json',
            'type': 'flat',
            'records[0]': myUser['id'],
            'forms[0]': myForm,
            'rawOrLabel': 'raw',
            'rawOrLabelHeaders': 'raw',
            'exportCheckboxLabel': 'false',
            'exportSurveyFields': 'false',
            'exportDataAccessGroups': 'false',
            'returnFormat': 'json',
        }

        try:
            form_data = urllib.urlencode(apiFields)
            headers = {'Content-Type': 'application/x-www-form-urlencoded',
                       'Accept' : 'application/json'}
            result = urlfetch.fetch(
                url=url,
                payload=form_data,
                method=urlfetch.POST,
                headers=headers)
            
            # self.response.write(json.dumps(form_data))
            self.response.write(result.content)
        except urlfetch.Error:
            logging.exception('Caught exception fetching url') 

# def post(self):
        # url = config['api_url']

        # r = json.loads(self.request.body)
        
        # try:
            # myUser = r['user']
			# myForm = r['formName']
			
			# if not(validate_user.validateUser(myUser['id'], myUser['key'])):
				# self.response.out.write('Unauthorized user')
				# return
		# except urlfetch.Error:
			# logging.exception('Exception with authorizing user')

        # apiFields = {
            # 'token': config['api_token'],
            # 'content': 'record',
            # 'format': 'json',
            # 'type': 'flat',
			# 'records[0]': myUser,
			# 'forms[0]': formName,
            # 'rawOrLabel': 'raw',
			# 'rawOrLabelHeaders': 'raw',
			# 'exportCheckboxLabel': 'false',
			# 'exportSurveyFields': 'false',
			# 'exportDataAccessGroups': 'false',
			# 'returnFormat': 'json',
        # }
        
        # try:
            # form_data = urllib.urlencode(apiFields)
            # headers = {'Content-Type': 'application/x-www-form-urlencoded',
                       # 'Accept' : 'application/json'}
            # result = urlfetch.fetch(
                # url=url,
                # payload=form_data,
                # method=urlfetch.POST,
                # headers=headers)
            # self.response.write(result.content)
        # except urlfetch.Error:
            # logging.exception('Caught exception fetching url') 
			
class ValidateUser(RestHandler):
    
    def post(self):
        r = json.loads(self.request.body)
                
        if (validate_user.validateUser(r['id'], r['key'])):
            self.response.out.write('AUTHORIZED')
        else:
            self.response.out.write('UNAUTHORIZED')
                
        return

APP = webapp2.WSGIApplication([
    ('/rest/redcap-metadata', RedcapGetFieldMetadataHandler),
    ('/rest/redcap-import-records', RedcapImportRecordsHandler),
    ('/rest/redcap-export-records', RedcapExportRecordsHandler),
    ('/rest/validate-user', ValidateUser)
], debug=True)

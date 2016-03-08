#! /usr/bin/python
# -*- coding: utf-8 -*-
#########
#Copyright (C) 2016 Mark Spurgeon <theduck.dev@gmail.com>
#
#    This program is free software: you can redistribute it and/or modify
#    it under the terms of the GNU General Public License as published by
#    the Free Software Foundation, either version 3 of the License, or
#    (at your option) any later version.
#
#    This program is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU General Public License for more details.
#
#    You should have received a copy of the GNU General Public License
#    along with this program.  If not, see <http://www.gnu.org/licenses/>.
#
################################
#
#   Portefeuille.py v1
#   a static portfolio generator
#
################################
#
#   Version: experimental
#   Author: Mark Spurgeon
#   Email: theduck.dev@gmail.com
#   Github: @the-duck
#   Licence: GNU GPL v3
#
#   Dependencies (modules): jinja2, yaml, Image(PIL)(always preloaded?), optparse (always preloaded?)
#
###############################


import jinja2
import os
import json
from yaml import load, dump
try:
    from yaml import CLoader as Loader, CDumper as Dumper
except ImportError:
    from yaml import Loader, Dumper

import Image
from optparse import OptionParser


if __name__=="__main__":
    ###
    # Set default arguments
    ###
    input_directory = "_portfolio"
    input_template = "templates/template.html"
    output_file = "index.html"
    max_image_size = 860
    ###
    # Options
    ###
    usage = "usage: %prog [options] arg1 arg2"
    parser = OptionParser(usage =usage)
    #parser.add_option("-h","--help", dest="help")
    parser.add_option("-i", "--input", dest="input",
                  help="Folder which contains your portfolio. (default= local '_portfolio' folder)", metavar="FOLDER")
    parser.add_option("-t", "--template", dest="template",
                  help="Template HTML file (default= 'template/template.html' )", metavar="FILE")
    parser.add_option("-o", "--output", dest="output",
                  help="Output file's name (must be HTML)", metavar="FILE")
    parser.add_option("-s","--size", type="int", dest="resize", help="The maximum image size you want to set, in pixels (default=860)")

    (options, args) = parser.parse_args()


    if options.resize!=None:
        max_image_size = options.resize
    if options.template!=None:
        input_template = options.template
    if options.input!=None:
        input_directory = options.input
    if options.output!=None:
        output_file = options.output




    #Get Portfolio gallery
    _is_directory =True

    if input_directory.startswith("/") and os.path.isdir(input_directory):
        portfolioDirectory = input_directory
    elif os.path.isdir(os.path.join(os.curdir, input_directory)):
        portfolioDirectory = os.path.join(os.curdir, input_directory)
    else:
        print("Directory not valid")
        _is_directory=False


    if _is_directory:
        ###
        # User's Information
        ###
        myself = {
        "name":"John Doe",
        "description":"I'm a narcissist",
        "picture":None,
        "status":"Call me baby",
        "email":None,
        "github":None
        }
        if os.path.isfile(os.path.join(portfolioDirectory, "myself.yaml")):
            my = open(os.path.join(portfolioDirectory, "myself.yaml"))
            m = my.read()
            mdata = load(m, Loader=Loader)
            if mdata.has_key('Myself'):
                for i in mdata["Myself"]:
                    if i.has_key("name"):
                        myself["name"] =i["name"]
                    if i.has_key("description"):
                        myself["description"] =i["description"]
                    if i.has_key("picture"):
                        myself["picture"] = os.path.join(input_directory,i["picture"])
                    if i.has_key("status"):
                        myself["status"] =i["status"]
                    if i.has_key("email"):
                        myself["email"] =i["email"]
                    if i.has_key("github"):
                        myself["github"] =i["github"]

        print myself['picture']

        ###
        # Portfolio gallery
        ###
        categories = [f for f in os.listdir(portfolioDirectory) if os.path.isdir(os.path.join(portfolioDirectory, f))]

        categories =sorted(categories, key=str.lower)

        output_categories = []
        for cat in categories:
            #Create category object
            catDict = {}
            catDict['title'] = cat.replace("_","-").replace("-"," ")
            catDict['id']= cat.replace("_","").lower()
            catDict['description'] = None
            #Find whole path relative to gallery.py
            catDir = os.path.join(portfolioDirectory, cat)
            #Get more information about category
            yml_file = os.path.join(catDir, "category.yaml")
            if os.path.isfile(yml_file):
                f = open(yml_file)
                fo = f.read()
                data = load(fo, Loader=Loader)
                if data.has_key("Category"):
                    for i in data["Category"]:
                        if i.has_key("title"):
                            catDict["title"] =i["title"]
                        if i.has_key("description"):
                            catDict["description"] = i["description"]
                f.close()
            catDict["collections"] = []
            #Find collections
            collections = [f for f in os.listdir(catDir) if os.path.isdir(os.path.join(catDir,f))]
            for col in collections:
                # 1 Collection
                colDict = {}
                colDict['title'] = col.replace("_"," ").replace("-"," ")
                colDict['id'] = colDict['title'].lower().replace(" ","-")
                colDict['description'] = None
                colDict["imageFile"] = {}
                colDict['type']="images"

                colDir = os.path.join(catDir, col)
                yml_file = os.path.join(colDir, "collection.yaml")
                if os.path.isfile(yml_file):
                    f = open(yml_file)
                    fo = f.read()
                    data = load(fo, Loader=Loader)
                    if data.has_key("Collection"):
                        for i in data["Collection"]:
                            if i.has_key("title"):
                                colDict["title"] =i["title"]
                            else:
                                print("[warning]: Collection's title is not specified, default is '{}' ".format(colDict['title']))
                            if i.has_key("description"):
                                colDict["description"] = i["description"]
                            else:
                                print("[warning]: Collection's description is not specified")
                            if i.has_key("type"):
                                colDict["type"] = i["type"]
                            else:
                                print("[warning]: Collection's type is not specified, default is 'images' ")
                            if i.has_key("link"):
                                colDict["link"] = i["link"]
                            else:
                                print("[warning]: Collection's link is not specified, I guess there isn't any link ")
                    f.close()
                else:
                    print("[warning]: 'collection.yaml' is missing in '{}'".format(colDict['title']))

                medias = [f for f in os.listdir(colDir) if os.path.isfile(os.path.join(colDir,f))]
                media_list = []
                for media in medias:
                    d = {}
                    d['title']=media.split('.')[0].replace("_"," ").replace("-"," ")

                    fi = os.path.join(colDir,media)

                    d["ext"]=os.path.splitext(fi)[1].lower()

                    accepted_exts = [".png",".jpg",".jpeg",".gif"]

                    if d['ext'] in accepted_exts and media.startswith(".")==False:
                        outfile =os.path.join(colDir,".thumbnail."+ media)
                        if fi != outfile:
                            try:
                                size = max_image_size, max_image_size
                                im = Image.open(fi)
                                im.thumbnail(size, Image.ANTIALIAS)
                                im.save(outfile, "JPEG")

                                fi = outfile
                            except IOError:
                                print "[warning]: Cannot create thumbnail for '%s'" % fi


                        if fi.startswith("./"):
                            fi= fi.replace("./","")
                        d['file']=fi

                        #Set Last image as collection's image
                        colDict["imageFile"] = d

                        media_list.append(d)
                    else:
                        pass
                colDict["media"] = media_list
                catDict["collections"].append(colDict)
            #back to category
            output_categories.append(catDict)
        #back to gallery



        #The HTML
        from jinja2 import Environment, FileSystemLoader
        env = Environment(loader=FileSystemLoader(''))
        if os.path.isfile(input_template):
            template = env.get_template(input_template)
            output_from_parsed_template = template.render(myself= myself,categories = output_categories)

            f = open(output_file,"w")
            f.write(output_from_parsed_template)
            print("- - - - - ")
            print("OK, your portfolio is good to go!")
        else:
            print("[Error] The template file '{}' doesn't exist".format(input_template))
    else:
        print("Please enter a valid path to your portfolio")

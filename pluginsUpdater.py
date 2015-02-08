#requires Duck Launcher version 0.69.2

import sys
import os
import json
sys.path.append("/usr/lib/duck_launcher")
import Plugins
if __name__=="__main__":
	rep = Plugins.Repo()
	plugins = rep._getPluginsFromGithub()
	plugins_string =  json.dumps(plugins,indent=4,sort_keys=True, separators=(',', ': '))

	pl_file= os.path.join(os.path.dirname(os.path.realpath(__file__)),"plugins/all.json")
	pl_o=open(pl_file,"w")
	pl_o.write(plugins_string)
	pl_o.close()


/**
 * Keel 2021 
 * 
 * Author:    Graham Atlee
 * Created:   05.14.2021
 * 
 * GNU Affero General Public License v3.0
 * 
 * This class handles functions related to listing and stopping
 * docker containers being run on the host. This class is NOT responsilbe
 * for updating the DOM.
 **/

//-------------------------------------------------------------------
// Dockerode dependency setup
//-------------------------------------------------------------------

const Docker = require('dockerode');
const socket = process.env.DOCKER_SOCKET || '/var/run/docker.sock';
const docker = new Docker({ socketPath: socket });

//-------------------------------------------------------------------
// Host containers class 
//-------------------------------------------------------------------

const hostContainers = {

        //return all running containers on the host's machine
        //TO-DO : add try catch block for err handling
        list : async function (){
            let runningContainers = [];
            let containerName = '';
            //pause JS runtime at this line so that no further code will execute 
            //until the async function has returned it's result.
            const containers = await docker.listContainers({ all : false });
            containers.forEach(container => {
                containerName = container.Names[0];
                runningContainers.push(containerName);
            })
 
            return runningContainers;
        }    
        
};

module.exports = hostContainers;
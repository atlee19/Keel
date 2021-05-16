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
const Docker = require('dockerode');

const socket = process.env.DOCKER_SOCKET || '/var/run/docker.sock';
const docker = new Docker({ socketPath: socket });

const hostContainers = {

        list : async function (){
            let runningContainers = [];
            const containers = await docker.listContainers({ all : false });
            containers.forEach(container => {
                let containerName = container.Names[0];
                runningContainers.push(containerName);
            })
 
            return runningContainers;
        }    
        
};

module.exports = hostContainers;
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
    listRunning = function(){
        let runningContainers = [];
       
        docker.listContainers({ all : false }, function(err, containers){
            //if no containers are running what gets displayed?
            for(let container in containers){
                //get name and date created 
                let name = containers[container].Names[0];
                let timeStamp = containers[container].Created;
                //put it into a json object
                let containerMetaData = { "name" : name, "created" : timeStamp };
                //add it to array 
                runningContainers.push(containerMetaData);
                //then return it - thats it
            }
        })

        return runningContainers;
    }
};
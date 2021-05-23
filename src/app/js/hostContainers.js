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

const hostContainers = (function(){
    const Docker = require('dockerode');
    const socket = process.env.DOCKER_SOCKET || '/var/run/docker.sock';
    const docker = new Docker({ socketPath : socket });

    async function getListOfActiveContainers(){
        let runningContainers = [];
        let containerName = '';
        let containerID = '';
        let containerImage = '';
        let containerStatus = '';
        //pause JS runtime at this line so that no further code will execute 
        //until the async function has returned it's result.
        const containers = await docker.listContainers({ all : false });
        containers.forEach(container => {
            containerID = container.Id.slice(0,12);
            containerName = container.Names[0].substring(1);
            containerImage = container.Image;
            containerStatus = container.Status;

            runningContainers.push({
                "Id": containerID,
                "Name": containerName,
                "Image": containerImage,
                "Status": containerStatus
            });
        })

        return runningContainers;
    }

    function stopSpecificContainer(containerId){
        docker.getContainer(containerId).stop();

        //display notification to user that container has been stopped
        //TO-DO: this should only be displayed once the container has TRULY been stopped
        const myNotification = new Notification('Container stopped', {
            body: `${containerId} has been stopped.`
        })
    }

    return{
        GetListOfActiveContainers: getListOfActiveContainers,
        StopSpecificContainer: stopSpecificContainer
    }

})();


module.exports = hostContainers;

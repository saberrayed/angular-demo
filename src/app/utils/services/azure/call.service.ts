import { Injectable } from '@angular/core';
import { AcceptCallOptions, AudioOptions, Call, CallAgent, CallClient, DeviceManager, IncomingCall, LocalVideoStream, RemoteParticipant, StartCallOptions, VideoOptions, VideoStreamRenderer, VideoStreamRendererView } from '@azure/communication-calling';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { CommunicationIdentityClient } from '@azure/communication-identity';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AudioService } from '../audio.service';
import { ACSService } from './acs.service';

@Injectable({
  providedIn: 'root',
})
export class CallService {
    
    incoming = new BehaviorSubject<any>(false);

    patientCommunicationUserId: any;
    
    token: any;
    user: any;
    // destination: any = '8:echo123';
    destination: any;
    callername: any;
  
    callClient: CallClient;
    callAgent: CallAgent;
    deviceManager: any;
  
    incomingCall: IncomingCall;
    currentCall: Call;
  
    // flags
    call = true;
    hangup = false;
    muted = true;
    video = true;
    isReady = false;
    hasIncomingCall = false;
  
    // devices
    microphones: any = [];
    cameras: any = [];
    speakers: any = [];
  
    // devices configuration
    cameraView: VideoStreamRendererView;
    selectedCamera: any;
    selectedMicrophone: any;
    otherUser: any;
  
    localVideoStream: LocalVideoStream;
    localVideoStreamRenderer: VideoStreamRenderer;
  
    //  Audio Instances
    ringInstance: HTMLAudioElement;
  
    constructor(
      private service: ACSService,
      private audio: AudioService
    ) {
        this.ringInstance = this.audio.ringInstance();
    }

    async initialize() {
        // Instantiate the identity client
        const client = new CommunicationIdentityClient(environment.acs_connection_string);
        let identityTokenResponse = await client.createUserAndToken(["voip"]);
        const { token, expiresOn, user } = identityTokenResponse;
        console.log("Current user communcation id :" + user?.communicationUserId);

        this.token = token;
        this.user = user;
        this.validateToken();
    }
  
    async initializeHandler() {
  
      this.callAgent.on('incomingCall', async (call) => {
        try {
            this.incomingCall = call.incomingCall;
  
            this.audioStart();
            this.incoming.next(this.hasIncomingCall = true);
  
            //const callerInfo = this.incomingCall.callerInfo;
            //const callInfo = this.incomingCall.info;
            //const incomingCallId = this.incomingCall.id
            //const callEndReason = this.incomingCall.callEndReason;
            
            this.incomingCall.on('callEnded', (call) => {
              this.incoming.next(this.hasIncomingCall = false);
              this.audioEnd();
              console.log(call.callEndReason);
            });
            
        } catch (error) {
            console.error(error);
        }
      });
    }
  
    async generateToken() {
      const response = await this.service.generateToken();
      this.token = response?.token;
      this.user = response?.user?.communicationUserId;
  
      this.validateToken();
    }
  
    async validateToken() {
  
      try {
        this.callClient = new CallClient();
        this.callAgent = await this.callClient.createCallAgent(new AzureCommunicationTokenCredential(this.token));
        this.deviceManager = await this.callClient.getDeviceManager();
  
        await this.deviceManager.askDevicePermission({ video: true});
        await this.deviceManager.askDevicePermission({ audio: true });
  
        this.isReady = true;
      } catch(error) {
        console.log(error);
        window.alert(error);
      }
  
      this.subscribeToDevice(this.deviceManager);
      this.initializeHandler();
      this.setupDevice();
    }
  
    async setupDevice() {
      // this.deviceManager = await this.callClient.getDeviceManager();
  
      this.cameras = await this.deviceManager.getCameras();
      this.microphones = await this.deviceManager.getMicrophones();
      this.speakers = await this.deviceManager.getSpeakers();
  
      this.selectedMicrophone = this.deviceManager.selectedMicrophone;
    }
  
    async displayLocalVideo() {
      try {
        this.localVideoStreamRenderer = new VideoStreamRenderer( await this.createLocalVideoStream());
        this.cameraView = await this.localVideoStreamRenderer.createView({ scalingMode: 'Crop' });
        document.getElementById('local-video-box').appendChild(this.cameraView.target);
        this.video = true;
      } catch (error) {
          console.error(error);
      } 
    }
  
    async removeLocalVideo() {
        try {
          this.localVideoStreamRenderer.dispose();
          this.video = false;
        } catch (error) {
            console.error(error);
        } 
    }
  
    async startCall() {
      try {
        const localVideoStream = this.video ? await this.createLocalVideoStream() : null;
        const videoOptions: VideoOptions = localVideoStream ? { localVideoStreams: [localVideoStream] } : undefined;
        const audioOptions: AudioOptions = { muted : this.muted };
        const startCallOptions: StartCallOptions = { videoOptions, audioOptions };
        this.currentCall =  await this.callAgent.startCall(
            // [{ id: '8:echo123' }],
            [{ communicationUserId: this.destination }],
            startCallOptions
        );
        this.subscribeToCall(this.currentCall);
      } catch (error) {
        console.error(error);
      }
    }
  
    async endCall() {
      try {
        await this.currentCall.hangUp({
          forEveryone: true
        });
        this.incoming.next(this.hasIncomingCall = false);
      } catch (error) {
        console.error(error);
      }
    }
  
    async acceptIncomingCall() {
        this.incoming.next(this.hasIncomingCall = false);
  
      try {      
        const localVideoStream = this.video ? await this.createLocalVideoStream() : null;
        const videoOptions: VideoOptions = localVideoStream ? { localVideoStreams: [localVideoStream] } : undefined;
        const startCallOptions: AcceptCallOptions = { videoOptions };
        this.currentCall = await this.incomingCall.accept(startCallOptions);
  
        
        if(this.muted) {
          await this.disableAudio();
        } else {
          await this.enableAudio()
        }
  
        console.log('incoming call states');
        // Subscribe to the call's properties and events.
        this.subscribeToCall(this.currentCall);
      } catch (error) {
          console.error(error);
      }
    }
  
    async rejectIncomingCall() {
        this.incoming.next(this.hasIncomingCall = false);
  
      try {
        await this.incomingCall.reject();
        this.incomingCall = null;
        this.audioEnd();
      } catch (error) {
        console.error(error);
      }
    }
  
    async subscribeToCall(call) {
  
      try {
  
        call.on('stateChanged', async () => {
          console.log(`Call state changed: ${call.state}`);
  
          if(call.state === 'Ringing') {
            this.audioStart();
          } else {
            this.audioEnd();
          }
        });
  
        call.localVideoStreams.forEach(async (stream) => {
          this.localVideoStream = stream;
          await this.displayLocalVideo();
        });
  
        call.remoteParticipants.forEach(remoteParticipant => {
          this.subscribeToRemoteParticipant(remoteParticipant);
        });
  
        call.on('localVideoStreamsUpdated', (localVideoStream) => {
          localVideoStream.added.forEach(async (stream) => {
            this.localVideoStream = stream;
            await this.displayLocalVideo();
          });
          localVideoStream.removed.forEach((stream) => {
            this.removeLocalVideo();
          });
        });
        
        call.on('remoteParticipantsUpdated', (participant) => {
          // Subscribe to new remote participants that are added to the call.
          participant.added.forEach(remoteParticipant => {
            console.log('add participant');
              this.subscribeToRemoteParticipant(remoteParticipant)
          });
          // Unsubscribe from participants that are removed from the call
          participant.removed.forEach(remoteParticipant => {
            console.log('remove participant');
              console.log('Remote participant removed from the call.');
          });
        });
      } catch (err) {
        console.error(err);
      }
    }
  
    async subscribeToDevice(deviceManager: DeviceManager) {
      deviceManager.on('audioDevicesUpdated', async (devices) => {
        console.log('Audio device updated');
        devices.added.forEach((device) => {
          console.log('Audio Device Added');
        });
        devices.removed.forEach((device) => {
          console.log('Audio Device Removed');
        });
        this.microphones = await deviceManager.getMicrophones();
      });
  
      deviceManager.on('selectedMicrophoneChanged', async () => {
        deviceManager.selectMicrophone(deviceManager.selectedMicrophone);
      });
  
      deviceManager.on('videoDevicesUpdated', async (devices) => {
        console.log('Video device updated');
  
        devices.added.forEach((device) => {
          console.log('Video Device Added');
        });
        devices.removed.forEach((device) => {
          console.log('Audio Device Removed');
        });
  
        this.cameras = await deviceManager.getCameras();
      });
  
      deviceManager.on('selectedMicrophoneChanged', async () => {
        deviceManager.selectMicrophone(deviceManager.selectedMicrophone);
      });
    }
  
    async subscribeToRemoteParticipant(remoteParticipant: RemoteParticipant) {
      try {
          // Inspect the initial remoteParticipant.state value.
          console.log(`Remote participant state: ${remoteParticipant.state}`);
          // Subscribe to remoteParticipant's 'stateChanged' event for value changes.
          remoteParticipant.on('stateChanged', () => {
              console.log(`Remote participant state changed: ${remoteParticipant.state}`);
          });
  
          // Inspect the remoteParticipants's current videoStreams and subscribe to them.
          remoteParticipant.videoStreams.forEach((remoteVideoStream) => {
              this.subscribeToRemoteVideoStream(remoteVideoStream)
          });
          // Subscribe to the remoteParticipant's 'videoStreamsUpdated' event to be
          // notified when the remoteParticiapant adds new videoStreams and removes video streams.
          remoteParticipant.on('videoStreamsUpdated', (stream) => {
              // Subscribe to new remote participant's video streams that were added.
              stream.added.forEach((remoteVideoStream) => {
                  this.subscribeToRemoteVideoStream(remoteVideoStream)
              });
              // Unsubscribe from remote participant's video streams that were removed.
              stream.removed.forEach((remoteVideoStream) => {
                  console.log('Remote participant video stream was removed.');
              })
          });
      } catch (error) {
          console.error(error);
      }
    }
  
    async subscribeToRemoteVideoStream (remoteVideoStream) {
      let renderer = new VideoStreamRenderer(remoteVideoStream);
      let view;
  
      const createView = async () => {
          // Create a renderer view for the remote video stream.
          view = await renderer.createView({ isMirrored: true,scalingMode: 'Crop' });
          // Attach the renderer view to the UI.
          document.getElementById('remote-video-box').appendChild(view.target);
      }
  
      // Remote participant has switched video on/off
      remoteVideoStream.on('isAvailableChanged', async () => {
          try {
              if (remoteVideoStream.isAvailable) {
                  await createView();
              } else {
                  view.dispose();
              }
          } catch (e) {
              console.error(e);
          }
      });
  
      // Remote participant has video on initially.
      if (remoteVideoStream.isAvailable) {
          try {
              await createView();
          } catch (e) {
              console.error(e);
          }
      }
  }
  
    //   // Create a local video stream for your camera device
    // createLocalVideoStream = async () => {
    //   const camera = (await this.deviceManager.getCameras())[0];
    //   if (camera) {
    //       return new LocalVideoStream(camera);
    //   } else {
    //       console.error(`No camera device found on the system`);
    //   }
    // }
  
    async selectMicrophone() {
      await this.deviceManager.selectMicrophone(this.selectedMicrophone);
    }
  
    async toggleMute() {
      this.muted = !this.muted;
  
      if(this.currentCall) {
        if(this.muted) {
          await this.disableAudio();
        } else {
          await this.enableAudio()
        }
      }
    }
  
    async toggleVideo() {
      this.video = !this.video;
  
      if(this.currentCall) {
        await this.toggleLiveVideo();
      }
    }
  
    async toggleLiveVideo() {
      if(this.video) {
        await this.enableLocalVideo();
      } else {
        await this.disableLocalVideo();
      }
    }
  
    async enableAudio() {
      try {
          await this.currentCall.unmute();
      } catch (error) {
          console.error(error);
      }
    }
  
    async disableAudio() {
      try {
          await this.currentCall.mute();
      } catch (error) {
          console.error(error);
      }
    }
  
    async enableLocalVideo() {
      try {
          const localVideoStream = await this.createLocalVideoStream();
          await this.currentCall.startVideo(localVideoStream);
      } catch (error) {
          console.error(error);
      }
    }
  
    async disableLocalVideo() {
      try {
          await this.currentCall.stopVideo(this.localVideoStream);
      } catch (error) {
          console.error(error);
      }
    }
  
    async createLocalVideoStream() {
      const camera = (await this.deviceManager.getCameras())[0];
      if (camera) {
          return new LocalVideoStream(camera);
      } else {
          console.error(`No camera device found`);
      }
    }
  
    audioStart() {
      console.log('audio started');
      this.ringInstance.currentTime = 0;
      this.ringInstance.play();
    }
  
    audioEnd() {
      console.log('audio ended');
      this.ringInstance.pause();
    }
  
    openSettings() {
    }
}

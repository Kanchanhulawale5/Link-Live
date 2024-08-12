import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import RtcEngine, { RtcEngineContext, ChannelProfileType, ClientRoleType, VideoCanvas, VideoRenderModeType } from 'react-native-agora';
import { AGORA_APP_ID } from './config';

const VideoCallScreen: React.FC = () => {
  const [engine, setEngine] = useState<RtcEngine | null>(null);
  const [joined, setJoined] = useState<boolean>(false);
  const [remoteUid, setRemoteUid] = useState<number | null>(null);
  const [muted, setMuted] = useState<boolean>(false);
  const [cameraOff, setCameraOff] = useState<boolean>(false);

  useEffect(() => {
    const init = async () => {
      const rtcEngine = await RtcEngine.create(AGORA_APP_ID);
      setEngine(rtcEngine);

      rtcEngine.addListener('Warning', (warn: any) => {
        console.log('Warning', warn);
      });

      rtcEngine.addListener('Error', (err: any) => {
        console.log('Error', err);
      });

      rtcEngine.addListener('UserJoined', (uid: number, elapsed: number) => {
        console.log('UserJoined', uid, elapsed);
        setRemoteUid(uid);
      });

      rtcEngine.addListener('UserOffline', (uid: number, reason: number) => {
        console.log('UserOffline', uid, reason);
        setRemoteUid(null);
      });

      rtcEngine.addListener('JoinChannelSuccess', (channel: string, uid: number, elapsed: number) => {
        console.log('JoinChannelSuccess', channel, uid, elapsed);
        setJoined(true);
      });

      await rtcEngine.enableVideo();
      await rtcEngine.setChannelProfile(ChannelProfileType.LiveBroadcasting);
      await rtcEngine.setClientRole(ClientRoleType.Broadcaster);
      await rtcEngine.joinChannel(null, 'test', null, 0);
    };

    init();

    return () => {
      if (engine) {
        engine.destroy();
      }
    };
  }, []);

  const toggleMute = () => {
    if (engine) {
      engine.muteLocalAudioStream(!muted);
      setMuted(!muted);
    }
  };

  const toggleCamera = () => {
    if (engine) {
      engine.muteLocalVideoStream(!cameraOff);
      setCameraOff(!cameraOff);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Video Call</Text>
      {joined && (
        <View style={styles.videoContainer}>
          <VideoCanvas uid={0} renderMode={VideoRenderModeType.Hidden} />
          {remoteUid !== null && (
            <VideoCanvas uid={remoteUid} renderMode={VideoRenderModeType.Hidden} />
          )}
        </View>
      )}
      <View style={styles.buttonContainer}>
        <Button title={`${muted ? 'Unmute' : 'Mute'} Microphone`} onPress={toggleMute} />
        <Button title={`${cameraOff ? 'Turn On' : 'Turn Off'} Camera`} onPress={toggleCamera} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  videoContainer: {
    width: '100%',
    height: '50%',
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  local: {
    width: '100%',
    height: '100%',
  },
  remote: {
    width: 120,
    height: 120,
    position: 'absolute',
    top: 10,
    right: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginTop: 20,
  },
});

export default VideoCallScreen;

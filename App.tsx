import React from 'react';
import { SafeAreaView } from 'react-native';
import VideoCallScreen from './videoCallScreen';

const App: React.FC = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <VideoCallScreen />
    </SafeAreaView>
  );
};

export default App;

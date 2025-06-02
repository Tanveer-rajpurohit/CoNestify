"use client";

import React from 'react';
import Channel from './channel/Channel';
import DM from './DM/DM';
import { selectedCommunication } from '@context/workspaceContext';

const Home = () => {
  const selctedCommunication = selectedCommunication((state)=>state.data);

  
  return (
    <>
    {selctedCommunication.type == "channel" && (
      <Channel />
    )}
    {selctedCommunication.type == "dm" && (
      <DM/>
    )}
    </>
  )
}
export default Home
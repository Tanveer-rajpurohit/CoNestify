"use client";

import React from 'react';
import Channel from './channel/Channel';
import DM from './DM/DM';
import { selectedCommunication } from '@context/workspaceContext';
import Meet from './meet/Meet';

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
    {selctedCommunication.type == "meet" && (
      <Meet/>
    )}
    </>
  )
}
export default Home
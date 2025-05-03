"use client";

import React from 'react';
import { useSidebarSelectionCommunication } from "../../../../context/SidebarSeletion"
import Channel from './channel/Channel';
import DM from './DM/DM';

const Home = () => {
  const selctedCommunication = useSidebarSelectionCommunication((state)=>state.data);

  
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
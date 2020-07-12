import React, { Component } from "react";
import { Text, View, Image } from 'react-native';
import { Container, StyleProvider, getTheme, Root } from "native-base";
import customVariables from '../../../assets/styles/variables';
import variables from "../../../assets/styles/variables";
import DeviceInfo from 'react-native-device-info';

export default class MBHRAN004 extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const buildNumber = DeviceInfo.getBuildNumber();
    const buildVersion = DeviceInfo.getVersion();
    
    return (
      <StyleProvider style={getTheme(customVariables)}>
        <Root>
          <Container>
            <View style={{ flex: 1, }}>
              <Image
                style={{ resizeMode: 'contain', alignSelf: 'center', marginTop: '33%', marginBottom: '8%' }}
                source={variables.images.logo} />
              <Text style={{ textAlign: 'center', marginBottom: '2%' }}>
                Phiên bản số: <Text style={{ fontWeight: 'bold' }}>{`${buildVersion} (${buildNumber})`}</Text>
              </Text>
              <Text style={{ textAlign: 'center', color: variables.textValue, fontWeight: 'bold' }}>Copyright © 2020 Tín Việt Soft – Giải Pháp Phần Mềm</Text>
              <Text style={{ textAlign: 'center', color: variables.textValue, fontWeight: 'bold' }}>All rights reserved</Text>
            </View>
          </Container>
        </Root>
      </StyleProvider>
    );
  }

}

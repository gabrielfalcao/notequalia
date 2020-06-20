import React, { Component } from "react";
import PropTypes, { InferProps } from "prop-types";
import { connect } from "react-redux";
import { StackNavigationProp } from "@react-navigation/stack";

import { Fab, Icon, Button } from "native-base";
import { RootStackParamList } from "../domain/navigation";

const MainMenuPropTypes = {
    error: PropTypes.string
};

type MainMenuProps =
    | (InferProps<typeof MainMenuPropTypes> & {
        navigation: StackNavigationProp<RootStackParamList>;
    })
    | any;
type MainMenuState = {
    active: boolean;
};

class MainMenu extends Component<MainMenuProps, MainMenuState> {
    static propTypes = MainMenuPropTypes;
    constructor(props: MainMenuProps) {
        super(props);
        this.state = {
            active: false
        };
    }

    render() {
        const { navigation }: MainMenuProps = this.props;
        console.log("MainMenu", Object.keys(this.props));
        return (
            <Fab
                active={this.state.active}
                direction="up"
                containerStyle={{}}
                style={{ backgroundColor: "#2c3e50" }}
                position="bottomRight"
                onPress={() => this.setState({ active: !this.state.active })}
            >
                <Icon type="SimpleLineIcons" name="screen-tablet" />
                <Button disabled style={{ backgroundColor: "#8e44ad" }}>
                    <Icon type="MaterialCommunityIcons" name="graphql" />
                </Button>
                <Button
                    disabled={navigation === undefined}
                    style={{ backgroundColor: "#d35400" }}
                    onPress={() => {
                        navigation.navigate("SearchDefinition");
                    }}
                >
                    <Icon
                        type="MaterialCommunityIcons"
                        name="textbox-password"
                    />
                </Button>
                <Button
                    style={{
                        backgroundColor: "#2980b9"
                    }}
                >
                    <Icon type="MaterialCommunityIcons" name="note-multiple" />
                </Button>
            </Fab>
        );
    }
}

export default connect<MainMenuProps>((state: MainMenuState) => {
    return { ...state };
}, {})(MainMenu);

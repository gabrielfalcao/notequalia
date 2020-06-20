import React, { Component } from "react";
import PropTypes, { InferProps } from "prop-types";
import { connect } from "react-redux";
import { StackNavigationProp } from "@react-navigation/stack";
import { DictionaryAPIClient } from "../networking";

import { Fab, Icon, Button } from "native-base";
import { RootStackParamList } from "../domain/navigation";

const MainMenuPropTypes = {
    error: PropTypes.string,
    addTerms: PropTypes.func
};
// https://flatuicolors.com/palette/defo
type MainMenuProps =
    | (InferProps<typeof MainMenuPropTypes> & {
        navigation: StackNavigationProp<RootStackParamList>;
    })
    | any;
type MainMenuState = {
    active: boolean;
};

class MainMenu extends Component<MainMenuProps, MainMenuState> {
    private api: DictionaryAPIClient;
    static propTypes = MainMenuPropTypes;
    constructor(props: MainMenuProps) {
        super(props);
        const { addError } = props;
        this.state = {
            active: false
        };
        this.api = new DictionaryAPIClient(addError);
    }
    public fetchDefinitions = () => {
        const { addTerms }: MainMenuProps = this.props;
        this.setState({ active: false });
        this.api.listDefinitions(addTerms);
    };

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
                        this.setState({ active: false });
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
                        backgroundColor: "#27ae60"
                    }}
                    onPress={() => {
                        this.fetchDefinitions();
                    }}
                >
                    <Icon type="MaterialCommunityIcons" name="reload" />
                </Button>
            </Fab>
        );
    }
}

export default connect<MainMenuProps>(
    (state: MainMenuState) => {
        return { ...state };
    },
    {
        addTerms: function(terms: TermListState[]) {
            return {
                type: "ADD_TERMS",
                terms
            };
        }
    }
)(MainMenu);

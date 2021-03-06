import React, { PureComponent } from 'react';
import { SelectionList } from '../../../components';
import i18n from '../../../config/i18n';
import { getBeneficiaries } from '../../../services/API/Salesforce/Contact';

interface BeneficiaryPickerProps {
  navigation: any;
  searchTxt: string;
}

export default class BeneficiaryPicker extends PureComponent<BeneficiaryPickerProps> {
  state = {
    beneficieries: null,
    filteredBeneficieries: null,
    searchTxt: '',
  };

  componentDidMount = async () => {
    const data = await getBeneficiaries();
    this.setState({ beneficieries: data, filteredBeneficieries: data });
  };

  filterMothers = text => {
    this.setState({ searchTxt: text });

    const { beneficieries } = this.state;
    const filteredBeneficieries = beneficieries.filter(
      obj => obj.Name.includes(text) || obj.Address_Locator__c.includes(text)
    );
    this.setState({ filteredBeneficieries });
  };

  onSelection = beneficiary => {
    const { survey } = this.props.navigation.state.params;
    this.props.navigation.push('Survey', {
      survey,
      beneficiary,
      headerTitle: i18n.t('NEW_SURVEY'),
    });
  };

  render() {
    return (
      <SelectionList
        data={this.state.filteredBeneficieries}
        titleKey="Name"
        subtitleKey="Address_Locator__c"
        onPress={item => {
          this.onSelection(item);
        }}
        searchTxt={this.props.searchTxt}
        searchBarLabel={i18n.t('SEARCH_BENEFICIARIES')}
        onSearchTextChanged={text => {
          this.filterMothers(text);
        }}
      />
    );
  }
}

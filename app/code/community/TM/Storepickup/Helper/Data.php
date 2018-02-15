<?php

class TM_Storepickup_Helper_Data extends Mage_Core_Helper_Abstract
{
    public function getShippingMethod()
    {
        $method = Mage::getStoreConfig('tm_storepickup/general/shipping_method');
        if (!$method) {
            $method = Mage::getStoreConfig('tm_storepickup/general/shipping_method_code');
        }
        return $method;
    }

    public function getAddressData()
    {
        $address = Mage::getStoreConfig('tm_storepickup/address');
        $address = array_filter($address);

        if (!empty($address['street'])) {
            $street = explode("\n", $address['street']);
            $address['street'] = array();
            foreach ($street as $line) {
                $address['street'][] = $line;
            }
        }

        return $address;
    }
}

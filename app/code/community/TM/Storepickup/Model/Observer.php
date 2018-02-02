<?php

class TM_Storepickup_Model_Observer
{
    public function applyPickupAddress($observer)
    {
        $controller = $observer->getControllerAction();
        $request = $controller->getRequest();

        if (!$request->isPost() || $request->getRouteName() !== 'firecheckout') {
            return;
        }

        $billing = $request->getParam('billing');
        if ($billing['use_for_shipping'] !== 'tm_storepickup') {
            return;
        }

        $billing['use_for_shipping'] = 0;
        $request->setPost('billing', $billing);

        $address = Mage::helper('tm_storepickup')->getAddressData();
        $request->setPost('shipping', array_merge($billing, $address));
    }
}

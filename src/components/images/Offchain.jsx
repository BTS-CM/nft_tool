import React, { useState } from 'react';
import {
  Textarea, Button, Group, Box, Text, Divider, Col, Paper, Radio,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';

import { appStore, beetStore, identitiesStore } from '../../lib/states';

function openURL(target) {
  window.electron.openURL(target);
}

export default function Offchain(properties) {
  const { t, i18n } = useTranslation();
  const setMode = appStore((state) => state.setMode);
  const asset_images = appStore((state) => state.asset_images);
  const setAssetImages = appStore((state) => state.setAssetImages);
  const setAsset = appStore((state) => state.setAsset);

  const changing_images = appStore((state) => state.changing_images);
  const setChangingImages = appStore((state) => state.setChangingImages);

  const [fileType, setFileType] = useState();

  const [value, setValue] = useState('');
  const [listItems, setListItems] = useState(
    changing_images && asset_images && asset_images.length ? asset_images : [],
  );

  function goBack() {
    if (changing_images) {
      setChangingImages(false);
    } else {
      setMode();
    }
  }

  // Avoid duplicate files, and add the URL to the list
  function addListItem() {
    const currentListItems = listItems;
    const existingListItem = listItems.filter((listItem) => listItem.url === value);
    if (!existingListItem.length) {
      currentListItems.push({ url: value, type: fileType });
      setListItems(currentListItems);
    }
    setValue('');
  }

  /**
   * Remove an IPFS item from the list
   * @param {Array} item
   */
  function removeListItem(item) {
    if (listItems && listItems.length === 1) {
      setListItems([]);
      return;
    }

    const currentListItems = listItems;
    const newListItems = currentListItems.filter((listItem) => listItem.url !== item);
    setListItems(newListItems);
  }

  // Proceed to the wizard page
  function proceed() {
    setChangingImages(false);
    setAssetImages(listItems);
  }

  const proceedButton = listItems && listItems.length ? (
    <Button
      sx={{ margin: '5px' }}
      onClick={() => {
        proceed();
      }}
    >
      {t('images:offchain.continueBtn')}
    </Button>
  ) : (
    <Button sx={{ margin: '5px' }} disabled>
      {t('images:offchain.continueBtn')}
    </Button>
  );

  const ipfsButton = value ? (
    <Button
      onClick={() => {
        addListItem();
      }}
    >
      {t('images:offchain.ipfsBtn')}
    </Button>
  ) : (
    <Button disabled>{t('images:offchain.ipfsBtn')}</Button>
  );

  return (
    <span>
      <Col span={12}>
        <Paper padding="sm" shadow="xs">
          <Box mx="auto" sx={{ padding: '10px' }}>
            <Text size="sm">
              {t('images:offchain.header')}
            </Text>
            <Radio.Group
              value={fileType}
              onChange={setFileType}
              name="fileTypeRadioGroup"
              label={t('images:offchain.typeLabel')}
              description={t('images:offchain.typeDesc')}
              withAsterisk
            >
              <Radio value="PNG" label="PNG" />
              <Radio value="JPEG" label="JPEG" />
              <Radio value="GIF" label="GIF" />
            </Radio.Group>
            {
              fileType
                ? (
                  <Textarea
                    label={t('images:offchain.ipfsURL')}
                    placeholder={`/ipfs/CID/fileName.${fileType} || /ipfs/CID`}
                    value={value}
                    autosize
                    minRows={1}
                    maxRows={1}
                    onChange={(event) => setValue(event.currentTarget.value)}
                    sx={{ marginTop: '10px', marginBottom: '10px' }}
                  />
                )
                : null
            }
            {ipfsButton}
            <Button
              sx={{ marginTop: '5px', marginLeft: '5px' }}
              onClick={() => {
                goBack();
              }}
            >
              {t('images:offchain.back')}
            </Button>
          </Box>
        </Paper>
      </Col>
      {listItems && listItems.length ? (
        <Col span={12}>
          <Paper padding="sm" shadow="xs">
            <Box mx="auto" sx={{ padding: '10px' }}>
              <Text size="sm" weight={600}>
                {t('images:offchain.urlHeader')}
              </Text>
              {listItems.map((item) => (
                <Group key={item.url} sx={{ margin: '5px' }}>
                  <Button
                    compact
                    variant="outline"
                    onClick={() => {
                      removeListItem(item.url);
                    }}
                  >
                    ❌
                  </Button>
                  <Text size="sm">
                    {item.url}
                    {' '}
                    (
                    {item.type}
                    )
                  </Text>
                </Group>
              ))}
              {proceedButton}
            </Box>
          </Paper>
        </Col>
      ) : (
        <Col span={12}>
          <Paper padding="sm" shadow="xs">
            <Box mx="auto" sx={{ padding: '10px' }}>
              <Text size="sm">
                {t('images:offchain.newHeader')}
              </Text>
              <Text size="sm">
                {t('images:offchain.serviceList')}
              </Text>
              <Button
                compact
                sx={{ margin: '2px' }}
                onClick={() => {
                  openURL('ipfs_pinata');
                }}
              >
                Pinata
              </Button>
              <Button
                compact
                sx={{ margin: '2px' }}
                onClick={() => {
                  openURL('ipfs_nft_storage');
                }}
              >
                NFT.Storage
              </Button>
              <Button
                compact
                sx={{ margin: '2px' }}
                onClick={() => {
                  openURL('ipfs_web3_storage');
                }}
              >
                Web3.Storage
              </Button>
              <Button
                compact
                sx={{ margin: '2px' }}
                onClick={() => {
                  openURL('ipfs_fleek');
                }}
              >
                Fleek
              </Button>
              <Button
                compact
                sx={{ margin: '2px' }}
                onClick={() => {
                  openURL('ipfs_infura');
                }}
              >
                Infura
              </Button>
              <Button
                compact
                sx={{ margin: '2px' }}
                onClick={() => {
                  openURL('ipfs_storj');
                }}
              >
                Storj DCS
              </Button>
              <Button
                compact
                sx={{ margin: '2px' }}
                onClick={() => {
                  openURL('ipfs_eternum');
                }}
              >
                Eternum
              </Button>
              <Button
                compact
                sx={{ margin: '2px' }}
                onClick={() => {
                  openURL('ipfs_docs');
                }}
              >
                IPFS NFT Docs
              </Button>
            </Box>
          </Paper>
        </Col>
      )}
    </span>
  );
}

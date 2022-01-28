import { Flex } from '@chakra-ui/react'
import { Asset } from '@shapeshiftoss/types'
import { useNavigate } from 'react-router-dom'
import { AssetSearch } from 'components/AssetSearch/AssetSearch'
import { Page } from 'components/Layout/Page'

export const Assets = () => {
  let navigate = useNavigate()
  const onClick = (asset: Asset) => {
    const url = asset.tokenId ? `/assets/${asset.chain}/${asset.tokenId}` : `/assets/${asset.chain}`
    navigate(url)
  }
  return (
    <Page style={{ flex: 1 }}>
      <Flex
        role='main'
        flex={1}
        flexDir='column'
        maxWidth='2xl'
        mx='auto'
        height={{ base: 'calc(100vh - 128px)', md: 'calc(100vh - 64px)' }}
        px={4}
      >
        <AssetSearch onClick={onClick} />
      </Flex>
    </Page>
  )
}

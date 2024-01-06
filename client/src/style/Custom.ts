import styled from 'styled-components'

export const Wrapper = styled.div``
type TitleProps = {
  active?: boolean;
};
export const Title = styled.h2`
  font-size: 24px;
  font-weight: 600;
  align-items: flex-start;
  margin-bottom: 40px;
  position: relative;

  @media only screen and (max-width: 768px) {
    margin-bottom: 15px;
  }
  :after {
    content: '';
    display: ${({ active }: TitleProps) => (active ? 'block' : 'none')};
    position: absolute;
    bottom: -15px;
    right: 50%;
    border-radius: 50%;
    width: 5px;
    height: 5px;
  }
`

type FlexProps = {
  justify?: string
  flex_direction?: string
  align_items?: string
  gap?: string
}
export const Flex = styled.div`
  display: flex;
  gap: ${({ gap }: FlexProps) => gap};
  justify-content: ${({ justify }: FlexProps) => justify};
  flex-direction: ${({ flex_direction }: FlexProps) => flex_direction};
  align-items: ${({ align_items }: FlexProps) => align_items};
`

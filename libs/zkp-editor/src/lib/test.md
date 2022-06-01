---
title: II. Idealizations
tags:
  - chapter
  - idealizations
  - thesis
id: 1fbefa5c-d5a1-4061-a043-e7c2ffd7c596
mtime: 20210701194946
ctime: 20210701194946
---

# II. Idealizations


{/*  turned out larger than expected. */}




# On Idealizations

## Idealization is the salient feature of models 

As mentioned previously, instead of focusing on the general process of abstraction by examining the relation between physical models and "reality", we will look at a specific feature of the practice of modeling which, as I will argue, best exemplifies the problems with drawing boundaries: idealization.

## What is idealization

For the purposes at hand, we don't need to identify all the necessary and sufficient conditions for counting something as an idealization. Instead, we can simply focus on a single crucial feature: they _falsely_ represent one or more aspects of the real world in order to ease calculation or reasoning ==(are these all the things people do with models? reasoning is pretty broad so should be safe)==. This mirrors the major issue with boundary drawing/discretization, namely that some boundary is drawn in order to facilitate reasoning about some object or concept, when identifying or justifying that boundary is difficult. The shared difficulty, then, consists in justifying either the use or reality of such simplifications.

However, while one of key features of idealizations is that they intentionally distort some aspect of the target system, 

{/* common descriptions of idealization specifically include the fact that they introduce a _false_ description, */}

we should not assume that the boundary drawing problem necessarily introduces false descriptions, as doing so would beg the question. Instead we will take the by-now familiar stance of examining _how, if at all_ the use of idealizations is justified 
{/*in physics?*/}
, and hopefully extrapolate from there.

### Characterizations of idealization?

Characterizations of idealizations are abound in the literature, although few dare claim to provide an exhaustive one. @Norton2012 's characterization of idealization as opposed to approximation is well received:

- Approximation: proposition which sort of describes the target
- Idealization: model whose properties sort of describe the target

Norton's standard example is a ball falling through the atmosphere. We have an excellent formula for calculating the velocity $v(t)$ starting at $v=t=0$ as$v(t)=\frac{g}{k}(1-\exp(-kt))=gt-\frac{gkt^2}{2}+\frac{gk^2t^3}{6}-\ldots$
where $g$ is the acceleration due to gravity, and $k$ a friction coefficient.

As any physics student knows, it is often convenient to leave out the influence of air resistance. Setting $k=0$ yields $v(t)=gt$.

Given Norton's distinction, we can view the above formula in two ways: either as an approximation or as an idealization. If we view it as an approximation, i.e. a proposition describing the actual system (a ball falling through the Earth's atmosphere) inexactly, we can say that this is a good approximation for the initial part of the ball's descent, becoming a worse and worse approximation as the ball continues to fall. We could also view it as an idealization, in which case we view the above equation as representing a (false) model of a ball falling in a vacuum. It is not the description of this model that is false, rather the model (idealization) misrepresents our world in some way, namely by leaving out air.

In this example, the difference between an approximation and an idealization is simply a matter of perspective: we can freely shift between viewing the formula as an approximation or idealization. This "shifting" Norton calls promotion and demotion respectively. Promotion consists in taking the approximation and taking it as the basis for describing a new, idealized model. In this case, removing the effect of air resistance is promoted to an idealized situation of an Earth without any atmosphere.  Demotion on the other hand consists in extracting one or more inexact propositions from an existing idealization and applying them to the actual system, e.g. seeing that in No-Air-Earth the speed of the ball is $v(t)=gt$ and applying it to the ball falling in our actual Earth. ==I mention this now because it will come in handy later==.

[@Strevens2007] puts forth another classification of idealizations, which characterizes idealizations more similarly to how I did above, as deliberate falsifications of reality. Specifically, Strevens conceptualizes idealizations in terms of the operation driving them: setting a parameter to zero, infinity, or some other number.


{/** TODO:  Write up a proper analysis of Streven's classification of idealizations.
    * 
    * labels: write, big
    * milestones: 
    */}
 


{/* ### Why do we not consider the target system an idealization? It's also a model */}



{/* ### Is idealization different than abstraction?*/}


## Narrowing

As is tradition by now, I wish to focus on a subsection of idealizations first in order to get a better grasp on them. Idealization as construed above does not differ that much from a model, indeed Norton even seems to treat them as synonyms. Analyzing models on their own is difficult, and since idealizations are difficult to distinguish from models entirely, analyzing idealizations on their own will in all likelihood also turn out to be difficult. Therefore let us turn to a more problematic example of idealization, one which has more easily identifiable examples: infinite idealizations.

Infinite idealizations (also called "asymptotic idealizations" by for instance [@Strevens2019] or "asymptotic explanation" by for instance \[cite//b:@Batterman2005]) are, put crudely, an idealization which is arrived at through some sort of limiting operation, through which a parameter of the original model is made to approach infinity[^infinitesimal]. Commonly discussed examples in the literature are the thermodynamic limit (TDL), the fractional quantum Hall effect (FQHE), the Aharanov-Bohm effect, infinite population models ….

As promised, infinite idealizations run into more obvious problems more quickly: in the thermodynamic limit the number of particles goes to infinity, the FQHE posits 2D particles, the AB effect requires an infinitely long solenoid and in order to explain gene distributions biologists assume infinite populations. _Prima facie_, the problem appears straightforward: such things do not exist. “Can you show me an infinitely long solenoid?”, the detractor exclaims. However, why does this appear so problematic? After all, was intentional misrepresentation not the characterizing feature of idealizations? Why is setting air resistance to $0$ less problematic than setting the $z$-axis to $0$?

…

## Characterizations of infinite idealizations



{/**
	* TODO: Good introduction of the literature review on infinite idealizations
	* Specifically, make it clear WHY you are looking at these sources, what you hope to gleam from them, and why doing such a survey is useful to begin with.
	* labels: write
	*/}

	

{/**
	* TODO: Expand the current literature review on infinite idealizations with at least one more source
	* labels: write 
	*/}



### Norton

First in @Norton2012 and more in depth in @Norton2014, Norton describes his unease with so-called “infinite idealizations”. Although never providing a strict definition, we can make an educated guess to one:

>[!definition] **Infinite Idealization (Norton)**
>
> An infinite idealization is made by performing a limiting operation on an idealized system, taking some parameter (such as length, number, volume) to either zero or infinity. The infinite idealization is a new system, namely the old system with the parameter _set_ to zero or infinity. However, these systems sometimes misbehave either the limit not being logically possible or conflicting in some other way with other assumptions we hold, ==which is bad==.

This characterization somewhat goes against the spirit of what Norton intends to argue, namely that such infinite idealizations are not idealizations at all, but can only be sensibly understood as _approximations_ as defined above. For "the essential starting point of the notion of idealization is that we have a consistently describable system, even if it is fictitious." [@Norton2014, pp. 200]  We should however not assume such strong requirements for idealizations, as whether "being consistently describable" is a good feature for a model to have _is_ what is under discussion. For now we will refer to these systems as infinite idealizations.

Norton furthermore distinguishes between _well-behaved_ and _ill-behaved idealizations_.[^well-behaved] _Ill-behaved_ idealizations are infinite idealizations whose limit system (the system with the parameter set to zero or infinity) does not match with target system in some way. This mismatch can take two forms [@Norton2012, (3.2, 3.3)]: the limit system might not exist, e.g., an infinite sphere, or the limit system might have a property which conflicts with a property of the target system. For the former, if we define a sphere as all points which are equidistant from some other point, then an infinite sphere does not exist, as there are no points at infinity. ($\mathbb{R}=(-\infty, \infty)$ not $[-\infty,\infty]$) For the latter, Norton imagines modeling an arbitrarily long ellipsoid as an infinite cylinder. While they look similar, the ratio of surface to volume for an ellipsoid is different from that for a cylinder, so the idealization has a fundamental mismatch.


{/**
	* TODO: Create figure which shows the differences between ellipsoid and cylinder volumes
	* labels: visualization
*/}


In short: for Norton infinite idealization simply is the end result of the process of a limiting operation. Furthermore, these idealizations can sometimes be well-behaved, and sometimes ill-behaved.

### Strevens

@Strevens2019a defines infinite idealization (or “asymptotic idealizations” as he calls them, we will stick with infinite here) slightly differently than Norton. Luckily, Strevens does provide a clear definition, which is in contrast to what he calls a “simple” idealization, which "is achieved by the straightforward operation of setting some parameter or parameters in the model to non-actual values, often zero". A clear example is the air-resistance coefficient above. At first, he contrasts this straightforwardly with infinite idealizations in the Nortonian sense, as “in \[infinite\] idealization, by contrast, a fiction is introduced by taking some sort of limit”. We will take this definition to be identical to Norton's.

However, later on in the paper Strevens adds another layer to the definition, 
{/*TODO: find a good quote for Strevens adding another layer to the definition for idealizations*/}
 namely that scientists use infinite idealizations when it is not possible to use a simple idealization to directly set the relevant property to zero (or infinity) 
{/*TODO: Clarify the distinction between infinite and "normal" idealizations for Strevens*/}
. Furthermore, he adds, “\[Infinite\] idealization is an interesting proposition, then, only in those cases where a simple substitution cannot be performed, which is to say only in those cases where a veridical model for mathematical reasons falls apart or otherwise behaves badly at the limiting value.” While Strevens later argues why these interesting cases (Norton's mismatches) _do_ make sense, we do not have to concern us with evaluating their correctness just yet, we simply need to note that Strevens makes the same distinction as Norton here. 

Then, we can define

>[!definition] **Infinite Idealization (Strevens):**
> 
> An infinite idealization is made by performing a limiting operation on a system, taking some "extrapolation" parameter (such as length, number, volume) to either zero or infinity **in order to set some other parameter to zero or infinity.** The infinite idealization is the system with the extrapolation parameter and the relevant paramenter set to either zero or infinity (dont' need to be the same). However, sometimes these systems misbehave, **which is interesting**.
_(bold to highlight differences with Norton)_


{/*Batterman also has some definition but it is rather vague.*/}


### Why this is confusing

I am not satisfied with definitions as they stand. They contain too many distinct criteria, such as whether the idealizations misbehave, how the limit is taken, and what kind of subset infinite idealizations form of idealizations in general. All putative infinite idealizations are discussed using the same umbrella term, even when the previously mentioned criteria differ. I believe that the discussion of infinite idealization would be much clearer if we were able to distinguish between the factors that contribute to the idealization braking down.

## A Categorization of Idealization

Focusing on the discussion of infinite idealizations solely, I believe 4 (maybe 5) distinctions can be drawn. I will first present the distinctions, and then show how I believe they are ordered. The goal is to create categories for (infinite) idealizations to facilitate reasoning and argument, since, as we have seen above, Norton and Strevens are not per se arguing over the same definition, even if it is close.

### Simple vs. Infinite Idealizations

Strevens -- and Norton less explicitly -- the discussion is presented as being about this distinction, but actually concerns a subclass of infinite idealizations we shall discuss below. However, the simple vs. infinite distinction is a useful one, but I will draw it differently than Strevens.

1) _Simple Idealization_.
   A simple idealization is an idealization in which no limit is taken in order to set the relevant parameter.
2) _Infinite Idealization_.
   An infinite idealization is one in which a limit is taken in order to set a parameter.

Note that no reference has been made to whether or not it affects another parameter, or whether the limit operation is successful. I argue that this is first and foremost the distinction between these idealizations, and that other qualities should be discussed separately. (I am not sure whether idealizations can be split up neatly into two disjoint sets like these (I'm not sure if that can be done at all, see [@WEBER2010]), but i'll just treat it like it does) 

This is a distinction based on _method_: _how_ is the idealization achieved? The idealized system might end up the same in some cases, but the operation is the relevant piece.

### Direct vs. Indirect Idealizations

This distinction is also due to Strevens, although he does not discuss it separately and makes it co-refering(?) with the first distinction. Direct idealizations, as the name implies, directly alter the relevant parameter e.g. setting air resistance to zero in order to have zero air resistance.  Indirect idealizations on the other hand, alter a parameter in order to alter the actually relevant parameter, e.g. infinite population in order to set genetic drift to zero, or infinite particles in order to achieve a singularity.

This is a distinction based on _goal_: _what_ should the idealization achieve? Indirect idealizations are sometimes necessary in order to get rid of a pesky parameter. Note that while this is an intention based distinction, in some models the same parameter might be set directly or indirectly. While in Newtonian Mechanics we might set the air resistance to zero directly, in a more complete QFT description of the same situation we have no access to such a parameter.

Also note that this distinction is not the same as the one between infinite and simple idealizations: as Strevens notes, it is completely in the realm of possibility to directly set a parameter to zero using an infinite limiting operation, "but you would merely be showing off."

Additionally, only infinite idealizations can be indirect, but not all are.

### Unproblematic/boring vs. problematic/interesting

(not sure what to call this yet, should be catchy)
This distinction is both due to Strevens and Norton, and is what I believe the main distinction we ought to discuss. This distinction is only relevant for **indirect infinite** idealizations, as both Norton and Strevens agree that all direct and simple idealizations provide little puzzlement. Indirect infinite idealizations can be boring i.e. there is no mismatch with the idealized system and the target system (I have no example), or interesting, by creating such a mismatch. All the idealizations under discussion fall under this category.

This is a distinction based on _result_: _what_ is the idealization like? (Not too sure about this characterization, not very catchy)

### Absent vs. Contradictory

(also unsure about these names) (other idea self-contradictory and "external"-contradictory? extracontradictory?)
This distinction is due to Norton, as Strevens does not explicitly distinguish between the two. This distinction only concerns **interesting idealizations**. For absent idealizations, the idealized model system simply cannot exist in its own terms: an infinite sphere does not denote anything. Contradictory idealizations, on the other hand, postulate some property of the model system which conflicts with another property we hold to be incontrovertible, or at least uncontroversial. Most of the idealizations under discussion fall under this category: infinite populations are not self contradictory, but they prevent probabilistic reasoning using uniform distributions.

This is a distinction based on ???

### Putative distinctions

There are two more distinctions of which I am not sure I can genuinely draw them.

#### Quantitative vs qualitative mismatch/contradiction.

- Quantitative Here I mean Norton's ellipsoid elongating to a cylinder: the mismatch comes from the ellipsoid having a certain volume/surface ratio in all finite stages, but a different one when infinitely long. No property is set to zero or infinity, unless you count "cylinderness".
- Qualitative Some property becomes true or false in the infinite limit which is not false or true in the finite case. Most of the actual examples are here: having or not having phase transitions, being 2D or 3D, exhibiting or not exhibiting an effect.

  The reason I doubt this distinction is that I feel like it's a question of framing. A very important question, which I should investigate, but not a distinction of kind per se.

#### Logical/transcendental contradiction vs a physical/intuitive contradiction.

Strevens uses the example of the infinite population idealization in evolutionary biology to exemplify the former: the main problem is that for an infinite population it is no longer possible to have countable additivity with a uniform distribution, and so you cannot use the Strong Law of Large Numbers and could not say anything about the probability of genetic drift (might be badly paraphrasing): the method itself is no longer useful, but it's not a direct self-contradiction as the infinite sphere, as an infinite population is a sensible concept. The latter is a bit more vague, but here I mean e.g. the thermodynamic limit: it does not work because it stipulates an infinite number of particles. However, this is in conflict with the whole idea that the world consists of molecules. BUT not directly so, as [@Shech2013] points out, it is only a real paradox if we stipulate that statistical mechanics in the thermodynamic limit is a true/accurate representation of the world, which we need to justify by e.g. (or i.e.? I don't know of any others) an indispensability argument.

This is a distinction based on????

I doubt this because the former category might refer to the same as “absent” idealizations.

## Order of the distinctions

I think the order is best explained by this beautiful diagram, the entire box being “idealization-space”. Not included is how this is linked to approximations, nor the distinctions I am unsure about, this is simply to show how the above distinctions work:

![](../media/idealization_distinctions.png)

## Discussion

While these distinctions might appear nitpicky, I think they are vital for making sure we are discussing the correct problem. Additionally, in making these distinctions it became clear that perhaps more distinctions need to be made, such as the specific nature of the contradiction induced, see Section X.

What is clear is how infinite idealizations (the interesting ones at least) differ from idealizations in general or simple ones. Infinite idealizations are a subcategory of idealizations, together with simple idealizations (whether they completely fill the category of idealization is left open). However, the distinction between infinite idealizations and simple idealizations does not prove particularly enlightening. Other distinctions will be more fruitful to investigate. I do not think this warrants a change in nomenclature per se, as there is substantial literature on infinite idealizations already. Clarification would be in order though.


# Footnotes

[^well-behaved]: Again, Norton actually does not consider ill-behaved idealizations to be idealizations at all, but for now we shall simply pretend he does in order to compare his stance.

[^infinitesimal]: (or zero, in case of infinitesimal idealizations. While there might be some differences between the two, for now I will assume they behave the same.)
